import { Table, Button, Form } from 'react-bootstrap';
import { FaCheck, FaTrash, FaCommentDots, FaReply } from 'react-icons/fa';

// Recibimos una nueva prop: onResponder
export default function ContactoTabla({
  contactos,
  ediciones,
  onEstadoChange,
  onGuardar,
  onEliminar,
  onResponder,
}) {
  const formatearFecha = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso ?? '';
    }
  };

  return (
    <Table striped bordered hover responsive variant="dark" style={{ verticalAlign: 'middle' }}>
      <thead>
        <tr>
          {/* ... encabezados iguales ... */}
          <th className="bg-success text-white">#</th>
          <th className="bg-success text-white">Nombre</th>
          <th className="bg-success text-white">Email</th>
          <th className="bg-success text-white">Teléfono</th>
          <th className="bg-success text-white">Mensaje</th>
          <th className="bg-success text-white">Estado</th>
          <th className="bg-success text-white">Fecha</th>
          <th className="bg-success text-white text-center">Acción</th>
        </tr>
      </thead>
      <tbody>
        {contactos.map((contacto, idx) => {
          const tieneCambios = !!ediciones[contacto._id];

          return (
            <tr key={contacto._id}>
              {/* ... columnas de datos iguales ... */}
              <td>{idx + 1}</td>
              <td className="fw-bold">{contacto.nombre}</td>
              <td>{contacto.email}</td>
              <td>{contacto.telefono}</td>
              <td style={{ maxWidth: '300px' }}>
                <div className="d-flex align-items-start gap-2">
                  <FaCommentDots className="text-success mt-1 flex-shrink-0" />
                  <span className="text-break small">{contacto.mensaje}</span>
                </div>
              </td>
              <td style={{ minWidth: '130px' }}>
                <Form.Select
                  size="sm"
                  className="bg-secondary text-white border-secondary"
                  value={ediciones[contacto._id]?.estado ?? contacto.estado}
                  onChange={(e) => onEstadoChange(contacto._id, e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="resuelto">Resuelto</option>
                </Form.Select>
              </td>
              <td className="small">{formatearFecha(contacto.createdAt)}</td>

              {/* COLUMNA DE ACCIONES ACTUALIZADA */}
              <td className="text-center">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => onResponder(contacto)}
                      title="Responder por email"
                      className="text-white"
                    >
                      <FaReply />
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onGuardar(contacto._id)}
                      disabled={!tieneCambios}
                      style={{ opacity: tieneCambios ? 1 : 0.5 }}
                      title="Guardar estado"
                    >
                      <FaCheck />
                    </Button>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onEliminar(contacto._id)}
                    title="Eliminar contacto"
                  >
                    <FaTrash />
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
