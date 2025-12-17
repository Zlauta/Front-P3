import { formatearDinero } from '@/utils/FormatearPrecio.js';
import { Table, Button } from 'react-bootstrap';

const MenuTabla = ({ menus, onEdit, onDelete }) => {
  return (
    <Table striped bordered responsive hover style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <thead className="bg-success text-white">
        <tr>
          <th className="tabla text-white">Imagen</th>
          <th className="tabla text-white">Nombre</th>
          <th className="tabla text-white">Descripción</th>
          <th className="tabla text-white">Precio</th>
          <th className="tabla text-white">Categoría</th>
          <th className="tabla text-white text-center">Acciones</th>
        </tr>
      </thead>
      <tbody style={{ background: '#1E2A26' }}>
        {menus.map((menu) => (
          <tr key={menu._id}>
            <td className="tabla text-center">
              <img
                src={menu.imagen || '/images/placeholder.svg'}
                alt={menu.nombre}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            </td>
            <td className="tabla text-white">{menu.nombre}</td>
            <td className="tabla text-white-50" style={{ maxWidth: '250px' }}>
              <div className="text-truncate">{menu.descripcion}</div>
            </td>
            <td className="tabla text-success fw-bold">{formatearDinero(menu.precio)}</td>
            <td className="tabla text-white">
              <span className="badge bg-secondary">{menu.categoria}</span>
            </td>
            <td className="text-center tabla">
              <Button variant="success" size="sm" className="m-1" onClick={() => onEdit(menu)}>
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="m-1"
                onClick={() => onDelete(menu._id, menu.nombre)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MenuTabla;
