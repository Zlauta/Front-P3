import { Table, Button, Form } from 'react-bootstrap';
import { FiCheck, FiTrash } from 'react-icons/fi';

export default function UsuariosTabla({ usuarios, ediciones, usuarioLogueado, onRolChange, onEstadoChange, onGuardar, onEliminar }) {
  
  const formatearFecha = (iso) => {
    try {
      return new Date(iso).toLocaleDateString() + ' ' + new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  };

  return (
    <Table striped bordered hover responsive variant="dark" style={{ verticalAlign: 'middle' }}>
      <thead>
        <tr>
          <th className="bg-success text-white">Usuario</th>
          <th className="bg-success text-white">Rol</th>
          <th className="bg-success text-white">Estado</th>
          <th className="bg-success text-white">Teléfono</th>
          <th className="bg-success text-white">Fecha</th>
          <th className="bg-success text-white text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => {
          const esMismoUsuario = usuario.email === usuarioLogueado?.email;
          const tieneCambios = !!ediciones[usuario._id];

          return (
            <tr key={usuario._id}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${usuario.nombre}&background=1aaf4b&color=fff&size=40`}
                    className="rounded-circle"
                    alt="avatar"
                  />
                  <div>
                    <div className="fw-bold">{usuario.nombre}</div>
                    <div className="small text-white-50">{usuario.email}</div>
                  </div>
                </div>
              </td>
              <td style={{ minWidth: '130px' }}>
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
              </td>
              <td style={{ minWidth: '130px' }}>
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
              </td>
              <td>{usuario.telefono}</td>
              <td>{formatearFecha(usuario.createdAt)}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onGuardar(usuario._id)}
                    disabled={!tieneCambios || esMismoUsuario}
                    style={{ opacity: tieneCambios ? 1 : 0.5 }}
                  >
                    <FiCheck />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onEliminar(usuario._id)}
                    disabled={esMismoUsuario}
                  >
                    <FiTrash />
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}