import { useEffect, useState } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '@/index.css';
import '@/api/clientAxios.js';
import { actualizarUsuario, obtenerUsuarios, eliminarUsuario } from '@/service/usuario.service.js';
import ConfirmModal from '@/components/ui/ConfirmModal.jsx';
import FormRegister from '@/pages/auth/FormularioRegistro.jsx';

function formatearFecha(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso ?? '';
  }
}

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [ediciones, setEdiciones] = useState({});
  const [mostrarForm, setMostrarForm] = useState(false);

  const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuario'));

  // ahora puedes acceder al email
  const emailLogueado = usuarioLogueado?.email;

  const cargar = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    cargar();
    const enAlmacenamiento = (evento) => {
      if (evento.key === 'usuarios') cargar();
    };
    window.addEventListener('storage', enAlmacenamiento);
    return () => window.removeEventListener('storage', enAlmacenamiento);
  }, []);

  const manejarCambio = (id, valor) => {
    setEdiciones((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        rol: valor,
      },
    }));
  };

  const manejarEstado = (id, valor) => {
    setEdiciones((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        estado: valor,
      },
    }));
  };

  const guardarCambios = async (id) => {
    const cambios = ediciones[id];
    if (!cambios) return;

    try {
      await actualizarUsuario(id, cambios);
      await cargar();
      setEdiciones((prev) => {
        const copia = { ...prev };
        delete copia[id];
        return copia;
      });

      Swal.fire({
        title: 'Usuario actualizado!',
        icon: 'success',
        iconColor: '#1aaf4b ',
        confirmButtonColor: '#1aaf4b ',
        timer: 1200,
        showConfirmButton: false,
        customClass: {
          popup: 'small-alert',
        },
      });
    } catch (error) {
      console.error('Error al guardar actualizar usuario:', error);
      Swal.fire({
        title: error.response.data.msg || 'Error al actualizar usuario',
        icon: 'error',
        confirmButtonColor: '#1aaf4b ',
      });
    }
  };
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState({ id: null });

  const manejarEliminar = (id) => {
    setConfirmTarget({ id });
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    try {
      await eliminarUsuario(confirmTarget.id);
      await cargar();

      Swal.fire({
        title: 'Usuario eliminado',
        icon: 'success',
        iconColor: '#1aaf4b ',
        confirmButtonColor: '#1aaf4b ',
        timer: 1200,
        showConfirmButton: false,
        customClass: {
          popup: 'small-alert',
        },
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      Swal.fire({
        title: error.response?.data?.msg || 'Error al eliminar usuario',
        icon: 'error',
        confirmButtonColor: '#1aaf4b ',
      });
    }
  };

  return (
    <div className="p-1">
      <h3 className="text-light fs-1 mt-5 mb-5">Usuarios registrados</h3>

      <Button variant="success" className="ms-lg-3 me-2 mb-4" onClick={() => setMostrarForm(true)}>
        Nuevo Usuario
      </Button>

      {mostrarForm && (
        <div className="page-wrapper mt-4">
          <h1 className="titulos-form">Nuevo Usuario</h1>
          <Container className="custom-form border rounded p-4 w-50 mb-5">
            <FormRegister fromAdmin={true} />
            <div className="mt-4 text-center">
              <Button variant="secondary" onClick={() => setMostrarForm(false)}>
                ← Volver
              </Button>
            </div>
          </Container>
        </div>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="tabla"> #</th>
            <th className="tabla">Nombre</th>
            <th className="tabla">Email</th>
            <th className="tabla">Rol</th>
            <th className="tabla">Estado</th>
            <th className="tabla">Telefono</th>
            <th className="tabla">Fecha </th>
            <th className="tabla">Acciones</th>
          </tr>
        </thead>
        <tbody style={{ background: '#1E2A26 ' }}>
          {usuarios.length ? (
            usuarios.map((usuario, idx) => (
              <tr key={usuario._id}>
                <td className="tabla">{idx + 1}</td>
                <td className="tabla">{usuario.nombre}</td>
                <td className="tabla">{usuario.email}</td>

                <td className="tabla">
                  <Form.Select
                    value={ediciones[usuario._id]?.rol ?? usuario.rol}
                    onChange={(e) => manejarCambio(usuario._id, e.target.value)}
                    disabled={usuario.email === usuarioLogueado?.email}
                  >
                    <option value="admin">administrador</option>
                    <option value="cliente">cliente</option>
                  </Form.Select>
                </td>
                <td className="tabla">
                  <Form.Select
                    value={ediciones[usuario._id]?.estado ?? usuario.estado}
                    onChange={(e) => manejarEstado(usuario._id, e.target.value)}
                    disabled={usuario.email === usuarioLogueado?.email}
                  >
                    <option value="activo">activo</option>
                    <option value="inactivo">inactivo</option>
                  </Form.Select>
                </td>
                <td className="tabla">{usuario.telefono}</td>
                <td className="tabla">{formatearFecha(usuario.createdAt)}</td>
                <td className="tabla d-flex flex-column gap-2">
                  <Button
                    className="btn-tabla"
                    size="sm"
                    variant="secondary"
                    onClick={() => guardarCambios(usuario._id)}
                    disabled={!ediciones[usuario._id] || usuario.email === usuarioLogueado?.email}
                  >
                    Guardar
                  </Button>
                  <Button
                    className="btn-tabla btn-eliminar"
                    size="sm"
                    variant="success"
                    onClick={() => manejarEliminar(usuario._id)}
                    disabled={usuario.email === usuarioLogueado?.email}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4">
                No hay usuarios registrados aún.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="text-light fs-5">
        Total: {usuarios.length} usuario{usuarios.length === 1 ? '' : 's'}
      </div>
      <ConfirmModal
        show={showConfirm}
        title={`¿Eliminar usuario?`}
        text={`Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
