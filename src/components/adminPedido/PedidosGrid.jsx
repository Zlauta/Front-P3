import { Row, Col, Card, Badge, Form, Button } from 'react-bootstrap';
import {
  FaCheck,
  FaTrash,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCalendarAlt,
  FaShoppingBag,
} from 'react-icons/fa';

export default function PedidosGrid({ pedidos, ediciones, onEstadoChange, onGuardar, onEliminar }) {
  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'entregado':
        return 'success';
      case 'cancelado':
        return 'danger';
      case 'pendiente':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Row xs={1} md={2} xl={3} xxl={4} className="g-4">
      {pedidos.map((pedido) => {
        const tieneCambios = !!ediciones[pedido._id];
        const estadoActual = ediciones[pedido._id]?.estado ?? pedido.estado;

        return (
          <Col key={pedido._id}>
            <Card className="h-100 shadow border-0" style={{ background: '#25332f' }}>
              <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center mt-2">
                <Badge bg="dark" className="border border-secondary">
                  #{pedido._id.slice(-6)}
                </Badge>
                <Badge bg={obtenerColorEstado(estadoActual)}>{estadoActual.toUpperCase()}</Badge>
              </Card.Header>

              <Card.Body className="text-white pt-0">
                <div className="d-flex align-items-center mb-3 pb-3 border-bottom border-secondary">
                  <img
                    src={`https://ui-avatars.com/api/?name=${pedido.cliente?.nombre || 'Client'}&background=1aaf4b&color=fff&size=64`}
                    alt="avatar"
                    className="rounded-circle me-3 border border-2 border-success"
                    style={{ width: '50px', height: '50px' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <h5 className="mb-0 text-truncate">{pedido.cliente?.nombre || 'Anónimo'}</h5>
                    <small className="text-white-50 text-truncate d-block">
                      {pedido.cliente?.email || 'Sin email'}
                    </small>
                  </div>
                </div>
                <div className="mb-3 bg-secondary bg-opacity-25 p-2 rounded">
                  <small className="text-white-50 d-block mb-1">
                    <FaShoppingBag className="me-1" /> Resumen:
                  </small>
                  <ul
                    className="list-unstyled mb-0 small text-light ps-2"
                    style={{ maxHeight: '80px', overflowY: 'auto' }}
                  >
                    {pedido.items?.map((item, i) => (
                      <li key={i} className="d-flex justify-content-between">
                        <span>{item.producto?.nombre}</span>
                        <span className="fw-bold">x{item.cantidad}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="d-flex justify-content-between align-items-end mb-3">
                  <div className="small text-white-50">
                    <div className="mb-1">
                      <FaMapMarkerAlt className="me-1" /> {pedido.direccion}
                    </div>
                    <div className="mb-1">
                      <FaPhoneAlt className="me-1" /> {pedido.telefono}
                    </div>
                    <div>
                      <FaCalendarAlt className="me-1" />{' '}
                      {new Date(pedido.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-white-50 small">Total</div>
                    <div className="fs-3 fw-bold text-success">${pedido.total}</div>
                  </div>
                </div>
                <Form.Group>
                  <Form.Label className="small text-white-50">Actualizar Estado</Form.Label>
                  <Form.Select
                    size="sm"
                    className="bg-secondary text-white border-secondary"
                    value={estadoActual}
                    onChange={(e) => onEstadoChange(pedido._id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="preparando">Preparando</option>
                    <option value="listo">Listo</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>

              <Card.Footer className="border-top-0 bg-transparent pb-3 pt-0 d-flex justify-content-between">
                {tieneCambios ? (
                  <Button
                    variant="success"
                    size="sm"
                    className="w-100 me-2"
                    onClick={() => onGuardar(pedido._id)}
                  >
                    <FaCheck className="me-2" /> Guardar
                  </Button>
                ) : (
                  <div className="w-100 me-2"></div>
                )}

                <Button variant="outline-danger" size="sm" onClick={() => onEliminar(pedido._id)}>
                  <FaTrash />
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
