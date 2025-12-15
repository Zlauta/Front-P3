import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FaEdit, FaTrash, FaUser, FaClock, FaCalendarAlt, FaUsers, FaStickyNote } from "react-icons/fa";
import { formatearFecha } from "@/utils/reservasUtil.js";

export default function ReservasGrid({ reservas, onEditar, onEliminar }) {
  return (
    <Row xs={1} md={2} xl={3} xxl={4} className="g-4">
      {reservas.map((reserva) => (
        <Col key={reserva._id}>
          <Card className="h-100 shadow border-0" style={{ background: "#25332f" }}>
            <Card.Header className="d-flex justify-content-between align-items-center border-bottom border-secondary bg-transparent pt-3">
              <Badge bg="success" className="fs-6">
                Mesa {reserva.mesa}
              </Badge>
              <div className="text-white small">
                <FaCalendarAlt className="me-1" />
                {formatearFecha(reserva.fecha)}
              </div>
            </Card.Header>
            <Card.Body className="text-white">
              <div className="mb-2 d-flex align-items-center">
                <FaUser className="me-2 text-success" />
                <span className="text-truncate" title={reserva.usuario?.email}>
                    {reserva.usuario?.email || "Sin usuario"}
                </span>
              </div>
              <div className="mb-2">
                <FaUsers className="me-2 text-success" />
                {reserva.cantidadPersonas} Personas
              </div>
              <div className="mb-2">
                <FaClock className="me-2 text-success" />
                {reserva.hora} hs
              </div>
              {reserva.notas && (
                <div className="mt-3 p-2 bg-dark rounded small text-white-50 fst-italic border border-secondary">
                  <FaStickyNote className="me-1" /> "{reserva.notas}"
                </div>
              )}
            </Card.Body>
            <Card.Footer className="bg-transparent border-top-0 d-flex justify-content-between pb-3">
              <Button variant="secondary" size="sm" onClick={() => onEditar(reserva)}>
                <FaEdit /> Editar
              </Button>
              <Button variant="danger" size="sm" onClick={() => onEliminar(reserva._id)}>
                <FaTrash /> Eliminar
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
}