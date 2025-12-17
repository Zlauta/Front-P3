import { formatearDinero } from '@/utils/FormatearPrecio.js';
import { Table, Button, Form } from 'react-bootstrap';
import { FaCheck, FaTrash, FaBoxOpen } from 'react-icons/fa';

export default function PedidosTabla({
  pedidos,
  ediciones,
  onEstadoChange,
  onGuardar,
  onEliminar,
}) {
  const formatearFecha = (iso) => {
    try {
      if (!iso) return '';
      return new Date(iso).toLocaleString();
    } catch {
      return iso ?? '';
    }
  };
  const listaPedidos = pedidos || [];

  return (
    <Table striped bordered hover responsive variant="dark" style={{ verticalAlign: 'middle' }}>
      <thead>
        <tr>
          <th className="bg-success text-white">#</th>
          <th className="bg-success text-white">Cliente</th>
          <th className="bg-success text-white">Items</th>
          <th className="bg-success text-white">Total</th>
          <th className="bg-success text-white">Dirección</th>
          <th className="bg-success text-white">Teléfono</th>
          <th className="bg-success text-white">Estado</th>
          <th className="bg-success text-white">Fecha</th>
          <th className="bg-success text-white text-center">Acción</th>
        </tr>
      </thead>
      <tbody>
        {listaPedidos.length > 0 ? (
          listaPedidos.map((pedido, idx) => {
            const tieneCambios = !!ediciones[pedido._id];

            return (
              <tr key={pedido._id}>
                <td>{idx + 1}</td>
                <td>
                  <div className="fw-bold">{pedido.cliente?.nombre ?? 'Sin cliente'}</div>
                  <div className="small text-white-50">{pedido.cliente?.email}</div>
                </td>
                <td>
                  <ul className="list-unstyled m-0 small">
                    {pedido.items?.map((item, i) => (
                      <li key={i}>
                        <FaBoxOpen className="me-1 text-success" />
                        {item.producto?.nombre}{' '}
                        <span className="text-white-50">× {item.cantidad}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="fw-bold text-success fs-5">{formatearDinero(pedido.total)}</td>
                <td className="small">{pedido.direccion}</td>
                <td className="small">{pedido.telefono}</td>
                <td>
                  <Form.Select
                    size="sm"
                    className="bg-secondary text-white border-secondary"
                    value={ediciones[pedido._id]?.estado ?? pedido.estado}
                    onChange={(e) => onEstadoChange(pedido._id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="preparando">Preparando</option>
                    <option value="listo">Listo</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </Form.Select>
                </td>
                <td className="small">{formatearFecha(pedido.createdAt)}</td>
                <td className="text-center">
                  <div className="d-flex flex-column gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onGuardar(pedido._id)}
                      disabled={!tieneCambios}
                      style={{ opacity: tieneCambios ? 1 : 0.5 }}
                      title="Guardar cambios"
                    >
                      <FaCheck />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onEliminar(pedido._id)}
                      title="Eliminar pedido"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="9" className="text-center py-4 text-white-50">
              No hay pedidos para mostrar.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}