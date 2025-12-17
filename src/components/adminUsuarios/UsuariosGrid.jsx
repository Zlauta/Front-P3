import { Row, Col, Card, Badge, Form, Button } from 'react-bootstrap';
import { FiTrash } from 'react-icons/fi';

export default function UsuariosGrid({
  usuarios,
  ediciones,
  usuarioLogueado,
  onRolChange,
  onEstadoChange,
  onGuardar,
  onEliminar,
}) {
  return (
    <Row xs={1} md={2} xl={3} xxl={4} className="g-4">
      {usuarios.map((usuario) => {
        const esMismoUsuario = usuario.email === usuarioLogueado?.email;
        const tieneCambios = !!ediciones[usuario._id];

        return (
          <Col key={usuario._id}>
            <Card className="h-100 shadow border-0" style={{ background: '#25332f' }}>
              <Card.Body className="d-flex flex-column align-items-center text-white">
                <div className="mb-3 position-relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${usuario.nombre}&background=1aaf4b&color=fff&size=128`}
                    alt={usuario.nombre}
                    className="rounded-circle border border-3 border-success"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <Badge
                    bg={usuario.estado === 'activo' ? 'success' : 'secondary'}
                    className="position-absolute bottom-0 start-50 translate-middle-x"
                  >
                    {ediciones[usuario._id]?.estado ?? usuario.estado}
                  </Badge>
                </div>

                <Card.Title className="fs-4 text-center mb-1">{usuario.nombre}</Card.Title>
                <Card.Subtitle className="mb-3 text-white-50 small">{usuario.email}</Card.Subtitle>

                <div className="w-100 mt-2">
                  <Form.Group className="mb-2">
                    <Form.Label className="small text-white-50">Rol</Form.Label>
                    <Form.Select
                      size="sm"
                      className="bg-secondary text-white border-secondary"
                      value={ediciones[usuario._id]?.rol ?? usuario.rol}
                      onChange={(e) => onRolChange(usuario._id, e.target.value)}
                      disabled={esMismoUsuario}
                    >
                      <option value="admin">Administrador</option>
                      <option value="cliente">Cliente</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small text-white-50">Estado</Form.Label>
                    <Form.Select
                      size="sm"
                      className="bg-secondary text-white border-secondary"
                      value={ediciones[usuario._id]?.estado ?? usuario.estado}
                      onChange={(e) => onEstadoChange(usuario._id, e.target.value)}
                      disabled={esMismoUsuario}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </Form.Select>
                  </Form.Group>

                  <hr className="border-secondary" />

                  <div className="d-flex justify-content-between text-white-50 small mb-1">
                    <span>
                      <i className="bi bi-telephone me-1"></i>
                      {usuario.telefono || 'N/A'}
                    </span>
                    <span>Creado: {new Date(usuario.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card.Body>

              <Card.Footer className="border-top-0 bg-transparent pb-3 pt-0 d-flex justify-content-between">
                {tieneCambios ? (
                  <Button
                    variant="success"
                    size="sm"
                    className="w-100 me-2"
                    onClick={() => onGuardar(usuario._id)}
                  >
                    Guardar
                  </Button>
                ) : (
                  <div className="w-100 me-2"></div>
                )}

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onEliminar(usuario._id)}
                  disabled={esMismoUsuario}
                >
                  <FiTrash />
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
