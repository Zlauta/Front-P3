import { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { FaStar, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ConfirmModal from '@/components/ui/ConfirmModal.jsx';

import { obtenerResenias, eliminarResenia, editarResenia } from '@/service/resenias.service.js';

const TablaResenias = () => {
  const [resenias, setResenias] = useState([]);

  const cargar = async () => {
    try {
      const data = await obtenerResenias();
      if (Array.isArray(data)) return setResenias(data);
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      setResenias([]);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const toggleEstado = async (resenia) => {
    try {
      const nuevoEstado = !resenia.activo;
      await editarResenia(resenia._id, { activo: nuevoEstado });
      await cargar();
      const toastMixin = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        background: '#fff',
        color: '#333',
      });

      toastMixin.fire({
        icon: 'success',
        title: nuevoEstado ? 'Reseña visible' : 'Reseña oculta',
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
    }
  };

  const manejarEliminar = async (id) => {
    setConfirmTarget({ id });
    setShowConfirm(true);
  };
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState({ id: null });

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    try {
      await eliminarResenia(confirmTarget.id);
      await cargar();
      Swal.fire('Eliminado', 'La reseña ha sido borrada.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar', 'error');
    }
  };

  const renderEstrellas = (cantidad) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < cantidad ? '#ffc107' : '#6c757d'} size={14} />
    ));
  };

  return (
    <div className="p-4">
      <h3 className="text-light mb-4">Administrar Reseñas</h3>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="tabla">Usuario</th>
              <th className="tabla">Calificación</th>
              <th className="tabla">Comentario</th>
              <th className="text-center tabla">Visible</th>
              <th className="text-center tabla">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(resenias) && resenias.length > 0 ? (
              resenias.map((resenia) => (
                <tr key={resenia._id}>
                  <td className="align-middle fw-bold tabla">{resenia.nombre || 'Anónimo'}</td>

                  <td className="align-middle tabla">
                    <div className="d-flex gap-1">{renderEstrellas(resenia.calificacion)}</div>
                  </td>
                  <td className="align-middle tabla">
                    <small className="fst-italic text-white-50">
                      "{resenia.comentario?.substring(0, 60)}
                      {resenia.comentario?.length > 60 ? '...' : ''}"
                    </small>
                  </td>

                  <td className="align-middle text-center tabla">
                    <Form.Check
                      type="switch"
                      id={`switch-${resenia._id}`}
                      checked={!!resenia.activo}
                      onChange={() => toggleEstado(resenia)}
                      label={resenia.activo ? 'Sí' : 'No'}
                      className={resenia.activo ? 'text-success fw-bold' : 'text-secondary'}
                    />
                  </td>
                  <td className="align-middle text-center tabla">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => manejarEliminar(resenia._id)}
                      title="Eliminar reseña"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-5 text-white-50 tabla">
                  {resenias === null ? 'Cargando reseñas...' : 'No hay reseñas registradas aún.'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <ConfirmModal
        show={showConfirm}
        title={`¿Borrar reseña?`}
        text={`Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText="Sí, borrar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default TablaResenias;
