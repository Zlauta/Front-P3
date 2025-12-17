import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// Importamos el helper
import { obtenerMesasDisponibles } from '@/utils/reservasUtil.js';

export default function EditarReservaModal({ show, onHide, reserva, onGuardar }) {
  const [datos, setDatos] = useState(reserva || {});
  const [horaMinima, setHoraMinima] = useState('');
  const [mesasDisponibles, setMesasDisponibles] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    if (reserva) {
      const fechaInput = new Date(reserva.fecha).toISOString().split('T')[0];
      setDatos({ ...reserva, fecha: fechaInput });
    }
  }, [reserva]);

  // Calcular hora mínima si es HOY
  useEffect(() => {
    if (!datos.fecha) return;
    const fechaInput = new Date(datos.fecha + 'T00:00:00');
    const esHoy = fechaInput.toDateString() === new Date().toDateString();
    setHoraMinima(esHoy ? new Date().toTimeString().slice(0, 5) : '');
  }, [datos.fecha]);

  // Actualizar lista de mesas cuando cambian las personas
  useEffect(() => {
    if (datos.cantidadPersonas) {
      const mesas = obtenerMesasDisponibles(datos.cantidadPersonas);
      setMesasDisponibles(mesas);
    } else {
      setMesasDisponibles([]);
    }
  }, [datos.cantidadPersonas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => {
      const nuevosDatos = { ...prev, [name]: value };
      // Si cambia personas, reseteamos mesa para forzar nueva selección válida
      if (name === 'cantidadPersonas') {
        nuevosDatos.mesa = '';
      }
      return nuevosDatos;
    });
  };

  const handleSubmit = () => {
    onGuardar(datos);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-white border-success">
        <Modal.Title>Modificar mi Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Cantidad Personas</Form.Label>
            <Form.Control
              type="number"
              name="cantidadPersonas"
              min="1"
              max="10"
              value={datos.cantidadPersonas || ''}
              onChange={handleChange}
            />
          </Form.Group>

          {/* SELECT DINÁMICO */}
          <Form.Group className="mb-3">
            <Form.Label>Mesa</Form.Label>
            <Form.Select
              name="mesa"
              value={datos.mesa || ''}
              onChange={handleChange}
              className="bg-secondary text-white border-secondary"
              disabled={!datos.cantidadPersonas}
            >
              <option value="">Seleccione mesa...</option>
              {mesasDisponibles.map((m) => (
                <option key={m} value={m}>
                  Mesa {m}
                </option>
              ))}
              {datos.mesa && !mesasDisponibles.includes(parseInt(datos.mesa)) && (
                <option value={datos.mesa}>Mesa {datos.mesa} (Actual)</option>
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              min={new Date().toISOString().split('T')[0]}
              value={datos.fecha || ''}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              type="time"
              name="hora"
              min={horaMinima}
              value={datos.hora || ''}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notas especiales</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notas"
              value={datos.notas || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-success">
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={!datos.mesa}>
          Confirmar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
