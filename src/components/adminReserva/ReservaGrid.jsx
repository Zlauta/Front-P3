import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FaEdit, FaTrash, FaUser, FaClock, FaCalendarAlt, FaUsers, FaStickyNote } from 'react-icons/fa';

export default function ReservasGrid({ reservas, onEditar, onEliminar }) {
  
  const formatearFecha = (isoString) => {
    return isoString ? new Date(isoString).toLocaleDateString("es-ES", { timeZone: "UTC" }) : "";
  };

  return (
    <Row xs={1} md={2} xl={3} xxl={4} className="g-4">
      {reservas.map((r) => (
        <Col key={r._id}>
          <Card className="h-100 shadow border-0" style={{ background: '#25332f' }}>
            <Card.Header className="d-flex justify-content-between align-items-center border-bottom border-secondary bg-transparent pt-3">
               <Badge bg="success">Mesa {r.mesa}</Badge>
               <small className="text-white-50"><FaCalendarAlt className="me-1"/>{formatearFecha(r.fecha)}</small>
            </Card.Header>
            <Card.Body className="text-white">
              <div className="mb-2 d-flex align-items-center">
                 <FaUser className="me-2 text-success"/>
                 <span className="text-truncate" title={r.usuario?.email}>
                    {r.usuario?.email || 'Usuario eliminado'}
                 </span>
              </div>
              <div className="mb-2"><FaUsers className="me-2 text-success"/>{r.cantidadPersonas} Personas</div>
              <div className="mb-2"><FaClock className="me-2 text-success"/>{r.hora} hs</div>
              {r.notas && (
                  <div className="mt-2 p-2 bg-dark rounded small text-white-50 border border-secondary">
                      <FaStickyNote className="me-1"/> {r.notas}
                  </div>
              )}
            </Card.Body>
            <Card.Footer className="bg-transparent border-top-0 d-flex justify-content-between pb-3">
               <Button variant="secondary" size="sm" onClick={() => onEditar(r)}><FaEdit/> Editar</Button>
               <Button variant="danger" size="sm" onClick={() => onEliminar(r._id)}><FaTrash/></Button>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
}