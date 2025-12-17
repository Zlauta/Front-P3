import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';

export default function ReplyModal({ show, onHide, onSend, destinatario }) {
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show && destinatario?.mensaje) {
      let cleanAsunto = destinatario.mensaje;

      if (cleanAsunto.length > 60) {
        cleanAsunto = cleanAsunto.substring(0, 60) + '...';
      }

      cleanAsunto = cleanAsunto.replace(/(\r\n|\n|\r)/gm, ' ');

      setAsunto(`Re: ${cleanAsunto}`);
      setMensaje('');
      setErrors({});
    }
  }, [show, destinatario]);

  const validarFormulario = () => {
    const newErrors = {};
    const regexAsunto = /^[a-zA-ZÀ-ÿ0-9.,;:¡!¿?\-()'"%°\s]+$/u;

    if (!asunto || asunto.trim().length < 3) {
      newErrors.asunto = 'El asunto debe tener al menos 3 caracteres.';
    } else if (asunto.length > 100) {
      newErrors.asunto = 'El asunto no puede superar los 100 caracteres.';
    } else if (!regexAsunto.test(asunto)) {
      newErrors.asunto = 'El asunto contiene caracteres no permitidos.';
    }

    if (!mensaje || mensaje.trim().length < 5) {
      newErrors.mensaje = 'El mensaje es muy corto (mínimo 5 caracteres).';
    } else if (mensaje.length > 2000) {
      newErrors.mensaje = 'El mensaje es muy largo (máximo 2000 caracteres).';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);
    await onSend({ asunto, mensaje });
    setEnviando(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="text-dark">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title className="fs-5">
          Responder a <span className="text-success">{destinatario?.nombre}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark text-white">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small text-white-50">Para:</Form.Label>
            <Form.Control
              type="text"
              value={destinatario?.email || ''}
              disabled
              className="bg-secondary text-white border-0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Asunto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Respuesta a tu consulta..."
              value={asunto}
              onChange={(e) => {
                setAsunto(e.target.value);

                if (errors.asunto) setErrors({ ...errors, asunto: null });
              }}
              className={`bg-dark text-white border-secondary ${errors.asunto ? 'is-invalid' : ''}`}
              autoFocus
              maxLength={100}
            />
            <Form.Control.Feedback type="invalid">{errors.asunto}</Form.Control.Feedback>
            <Form.Text className="text-white-50 small">{asunto.length}/100 caracteres</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={mensaje}
              onChange={(e) => {
                setMensaje(e.target.value);
                if (errors.mensaje) setErrors({ ...errors, mensaje: null });
              }}
              className={`bg-dark text-white border-secondary ${errors.mensaje ? 'is-invalid' : ''}`}
              maxLength={2000}
            />
            <Form.Control.Feedback type="invalid">{errors.mensaje}</Form.Control.Feedback>
            <Form.Text className="text-white-50 small">{mensaje.length}/2000 caracteres</Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={onHide} disabled={enviando}>
              Cancelar
            </Button>
            <Button variant="success" type="submit" disabled={enviando}>
              {enviando ? (
                'Enviando...'
              ) : (
                <>
                  <FaPaperPlane className="me-2" />
                  Enviar Respuesta
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
