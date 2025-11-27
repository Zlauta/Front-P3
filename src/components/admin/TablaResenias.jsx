import React from 'react';
import { Table, Button, Form, Badge } from 'react-bootstrap';
import { FaTrash, FaStar } from 'react-icons/fa';
import { cambiarEstadoResenia, eliminarResenia } from '../../service/resenias.service.js'; // Ajusta la ruta si es necesario
import Swal from 'sweetalert2';

const TablaResenias = ({ resenias = [], updateList }) => {

  const handleToggle = async (id, estadoActual) => {
    try {
      await cambiarEstadoResenia(id, estadoActual);
      updateList();
      
      const Toast = Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 2000,
        background: '#254630', color: '#fff'
      });
      
      Toast.fire({ 
        icon: 'success', 
        title: !estadoActual ? 'Reseña ahora VISIBLE' : 'Reseña ahora OCULTA' 
      });

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar reseña?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1aaf4b',
      background: '#254630',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await eliminarResenia(id);
        updateList();
        Swal.fire({
          title: 'Eliminado',
          background: '#254630',
          color: '#fff',
          confirmButtonColor: '#1aaf4b'
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const tableStyle = { backgroundColor: '#254630', color: '#fff', borderColor: '#1aaf4b' };

  return (
    <div className="table-responsive">
      <Table bordered hover style={{ color: '#fff', verticalAlign: 'middle' }}>
        <thead style={{ backgroundColor: '#122117', color: '#1aaf4b', margin:"30px" }}>
          <tr>
            <th>Usuario</th>
            <th>Comentario</th>
            <th>Calificación</th>
            <th className="text-center">Visibilidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(resenias) && resenias.length > 0 ? (
            resenias.map((resenia) => (
              <tr key={resenia._id} style={tableStyle}>
                <td>{resenia.nombre}</td>
                <td>{resenia.comentario}</td>
                <td>
                  {resenia.calificacion} <FaStar color="#ffc107" className="mb-1"/>
                </td>
                
                <td className="text-center">
                  <div className="d-flex flex-column align-items-center">
                    <Form.Check 
                      type="switch"
                      id={`switch-${resenia._id}`}
                      checked={resenia.activo}
                      onChange={() => handleToggle(resenia._id, resenia.activo)}
                      style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: resenia.activo ? '#1aaf4b' : '#aaa' }}>
                      {resenia.activo ? "Visible" : "Oculto"}
                    </span>
                  </div>
                </td>

                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(resenia._id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No hay reseñas.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TablaResenias;