import { Row, Col, Card, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaClock, FaCalendarAlt, FaUsers, FaUtensils, FaEdit, FaTrash } from 'react-icons/fa';
import { formatearFecha } from '@/utils/reservasUtil.js';
import Temporizador from '@/components/userReservas/Temporizador.jsx';

// Agregamos "reservas = []" para evitar el error de "map of undefined"
export default function ReservasClientGrid({ reservas = [], onEditar, onEliminar }) {
  // Regla de Negocio: Solo permitir editar si faltan más de 24 horas
  const sePuedeEditar = (fecha, hora) => {
    try {
      const fechaISO = new Date(fecha).toISOString().split('T')[0];
      const fechaReserva = new Date(`${fechaISO}T${hora}:00`);
      const ahora = new Date();
      const diferenciaHoras = (fechaReserva - ahora) / (1000 * 60 * 60);
      return diferenciaHoras > 24;
    } catch (error) {
      return false;
    }
  };

  return (
    // CAMBIO 1: Grilla más ajustada (más columnas por fila = cards más chicas)
    <Row xs={1} sm={2} md={3} lg={4} xxl={5} className="g-3 d-flex justify-content-center">
      {reservas.map((reserva) => {
        const esEditable = sePuedeEditar(reserva.fecha, reserva.hora);

        return (
          <Col key={reserva._id}>
            <Card className="h-100 shadow-sm border-0" style={{ background: '#25332f' }}>
              {/* HEADER (Padding reducido py-2) */}
              <Card.Header className="d-flex justify-content-between align-items-center border-bottom border-secondary bg-transparent py-2">
                <div className="d-flex align-items-center text-truncate">
                  <FaUtensils className="text-success me-2 flex-shrink-0" />
                  <span className="text-white fw-bold text-truncate">Mesa {reserva.mesa}</span>
                </div>
                <Badge bg="success" className="text-dark flex-shrink-0 ms-1">
                  Confirmada
                </Badge>
              </Card.Header>

              {/* BODY */}
              <Card.Body className="text-white d-flex flex-column p-3">
                {/* Cronómetro (Más compacto: p-2 y fs-5) */}
                <div className="text-center mb-3 p-2 rounded bg-dark bg-opacity-50 border border-secondary">
                  <div className="text-white-50 small mb-1">
                    <FaClock className="me-1" /> Tiempo restante:
                  </div>
                  <div className="fs-5 fw-bold">
                    <Temporizador fecha={reserva.fecha} hora={reserva.hora} />
                  </div>
                </div>

                {/* Datos (Texto un poco más chico) */}
                <div className="small">
                  <div className="d-flex justify-content-between mb-2 border-bottom border-secondary pb-2">
                    <span className="text-white-50">
                      <FaCalendarAlt className="me-2" />
                      Fecha:
                    </span>
                    <span>{formatearFecha(reserva.fecha)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 border-bottom border-secondary pb-2">
                    <span className="text-white-50">
                      <FaClock className="me-2" />
                      Hora:
                    </span>
                    <span>{reserva.hora} hs</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-white-50">
                      <FaUsers className="me-2" />
                      Personas:
                    </span>
                    <span>{reserva.cantidadPersonas}</span>
                  </div>
                </div>
              </Card.Body>

              {/* FOOTER */}
              <Card.Footer className="bg-transparent border-top-0 d-flex gap-2 pb-3 pt-0 px-3">
                {esEditable ? (
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="w-50"
                    onClick={() => onEditar(reserva)}
                  >
                    <FaEdit className="me-1" /> Modificar
                  </Button>
                ) : (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-${reserva._id}`} className="small">
                        Solo modificable con 24hs de antelación.
                      </Tooltip>
                    }
                  >
                    <span className="d-inline-block w-50">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="w-100"
                        disabled
                        style={{ pointerEvents: 'none', opacity: 0.5 }}
                      >
                        <FaEdit className="me-1" /> Modificar
                      </Button>
                    </span>
                  </OverlayTrigger>
                )}

                <Button
                  variant="outline-danger"
                  size="sm"
                  className="w-50"
                  onClick={() => onEliminar(reserva._id)}
                >
                  <FaTrash className="me-1" /> Cancelar
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
