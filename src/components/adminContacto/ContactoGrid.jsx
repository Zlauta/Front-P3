import { Row, Col, Card, Badge, Form, Button } from 'react-bootstrap';
import {
  FaCheck,
  FaTrash,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaCommentDots,
  FaReply,
} from 'react-icons/fa';

export default function ContactoGrid({
  contactos,
  ediciones,
  onEstadoChange,
  onGuardar,
  onEliminar,
  onResponder,
}) {
  return (
    <Row xs={1} md={2} xl={3} xxl={4} className="g-4">
      {contactos.map((contacto) => {
        const tieneCambios = !!ediciones[contacto._id];
        const estadoActual = ediciones[contacto._id]?.estado ?? contacto.estado;

        return (
          <Col key={contacto._id}>
            <Card className="h-100 shadow border-0" style={{ background: '#25332f' }}>
              <Card.Body className="text-white d-flex flex-column">
                <div className="d-flex align-items-center mb-3 border-bottom border-secondary pb-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${contacto.nombre}&background=1aaf4b&color=fff&size=64`}
                    alt="avatar"
                    className="rounded-circle me-3 border border-2 border-success"
                    style={{ width: '50px', height: '50px' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <h5 className="mb-0 text-truncate">{contacto.nombre}</h5>
                    <Badge bg={estadoActual === 'resuelto' ? 'success' : 'warning'} text="dark">
                      {estadoActual.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="small text-white-50 mb-3">
                  <div
                    className="d-flex align-items-center mb-1 text-truncate"
                    title={contacto.email}
                  >
                    <FaEnvelope className="me-2 text-success" /> {contacto.email}
                  </div>
                </div>
                <div className="bg-secondary bg-opacity-25 p-3 rounded mb-3 flex-grow-1">
                  <p
                    className="small mb-0 fst-italic text-light"
                    style={{ maxHeight: '100px', overflowY: 'auto' }}
                  >
                    "{contacto.mensaje}"
                  </p>
                </div>

                <Form.Group className="mb-0">
                  <Form.Label className="small text-white-50">Estado</Form.Label>
                  <Form.Select
                    size="sm"
                    className="bg-secondary text-white border-secondary"
                    value={estadoActual}
                    onChange={(e) => onEstadoChange(contacto._id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="resuelto">Resuelto</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
              <Card.Footer className="border-top-0 bg-transparent pb-3 pt-0">
                <div className="d-flex gap-2 mb-2">
                  <Button
                    variant="info"
                    size="sm"
                    className="w-100 text-white"
                    onClick={() => onResponder(contacto)}
                  >
                    <FaReply className="me-2" />
                    Responder
                  </Button>
                </div>
                <div className="d-flex justify-content-between">
                  {tieneCambios ? (
                    <Button
                      variant="success"
                      size="sm"
                      className="w-100 me-2"
                      onClick={() => onGuardar(contacto._id)}
                    >
                      <FaCheck className="me-2" /> Guardar
                    </Button>
                  ) : (
                    <div className="w-100 me-2"></div>
                  )}

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onEliminar(contacto._id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
