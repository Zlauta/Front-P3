import { useEffect, useState } from 'react';
import { Button, Container, ButtonGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '@/index.css';
import '@/api/clientAxios.js';
import { actualizarUsuario, obtenerUsuarios, eliminarUsuario } from '@/service/usuario.service.js';
import ConfirmModal from '@/components/ui/ConfirmModal.jsx';
import FormRegister from '@/pages/auth/FormularioRegistro.jsx';
import { FiGrid, FiPlusCircle } from 'react-icons/fi';
import { FaT } from 'react-icons/fa6';
import { FaTable } from 'react-icons/fa';
import UsuariosGrid from '@/components/adminUsuarios/UsuariosGrid.jsx';
import UsuariosTable from '@/components/adminUsuarios/UsuariosTabla.jsx';
import UsuariosTabla from '@/components/adminUsuarios/UsuariosTabla.jsx';


export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [ediciones, setEdiciones] = useState({});
  const [mostrarForm, setMostrarForm] = useState(false);
  const [vista, setVista] = useState('grid');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState({ id: null });

  const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuario'));

  // --- LOGICA DE DATOS ---
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

  // --- LOGICA DE EDICION ---
  const manejarCambioRol = (id, valor) => {
    setEdiciones((prev) => ({ ...prev, [id]: { ...prev[id], rol: valor } }));
  };

  const manejarCambioEstado = (id, valor) => {
    setEdiciones((prev) => ({ ...prev, [id]: { ...prev[id], estado: valor } }));
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
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        timer: 1200,
        showConfirmButton: false,
        customClass: { popup: 'small-alert' },
      });
    } catch (error) {
      Swal.fire({ title: error.response?.data?.msg || 'Error', icon: 'error', confirmButtonColor: '#1aaf4b' });
    }
  };

  // --- LOGICA DE ELIMINACION ---
  const confirmarEliminacion = (id) => {
    setConfirmTarget({ id });
    setShowConfirm(true);
  };

  const ejecutarEliminacion = async () => {
    setShowConfirm(false);
    try {
      await eliminarUsuario(confirmTarget.id);
      await cargar();
      Swal.fire({
        title: 'Usuario eliminado',
        icon: 'success',
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        timer: 1200,
        showConfirmButton: false,
        customClass: { popup: 'small-alert' },
      });
    } catch (error) {
      Swal.fire({ title: error.response?.data?.msg || 'Error', icon: 'error', confirmButtonColor: '#1aaf4b' });
    }
  };

  // Props comunes para pasar a los hijos
  const commonProps = {
    usuarios,
    ediciones,
    usuarioLogueado,
    onRolChange: manejarCambioRol,
    onEstadoChange: manejarCambioEstado,
    onGuardar: guardarCambios,
    onEliminar: confirmarEliminacion
  };

  return (
    <div className="p-4">
      {/* HEADER Y BOTONES */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 mt-4">
        <h3 className="text-light fs-1 m-0">Usuarios registrados</h3>
        <div className="d-flex gap-3 align-items-center mt-3 mt-md-0">
          <ButtonGroup>
            <Button
              variant={vista === 'grid' ? 'success' : 'outline-secondary'}
              onClick={() => setVista('grid')}
              title="Vista de Tarjetas"
            >
              <FiGrid className="mb-1 me-1" />
            </Button>
            <Button
              variant={vista === 'table' ? 'success' : 'outline-secondary'}
              onClick={() => setVista('table')}
              title="Vista de Lista"
            >
              <FaTable className="mb-1 me-1" />
            </Button>
          </ButtonGroup>

          <Button variant="success" onClick={() => setMostrarForm(true)}>
            <FiPlusCircle className="mb-1 me-2" />Nuevo
          </Button>
        </div>
      </div>

      {/* MODAL DE REGISTRO */}
      {mostrarForm && (
        <div className="page-wrapper mb-5">
          <Container className="custom-form border rounded p-4 w-100 mw-75 bg-dark text-white">
            <h2 className="text-center mb-4">Nuevo Usuario</h2>
            <FormRegister fromAdmin={true} />
            <div className="mt-4 text-center">
              <Button variant="outline-light" onClick={() => setMostrarForm(false)}>Cancelar</Button>
            </div>
          </Container>
        </div>
      )}

      {/* RENDERIZADO CONDICIONAL DE HIJOS */}
      {usuarios.length === 0 ? (
        <div className="text-center text-light py-5 border rounded bg-dark">
          <h4>No hay usuarios registrados aún.</h4>
        </div>
      ) : vista === 'grid' ? (
        <UsuariosGrid {...commonProps} />
      ) : (
        <UsuariosTabla {...commonProps} />
      )}

      <div className="text-light fs-5 mt-4 text-end">
        Total: {usuarios.length} usuario{usuarios.length === 1 ? '' : 's'}
      </div>

      <ConfirmModal
        show={showConfirm}
        title={`¿Eliminar usuario?`}
        text={`Esta acción no se puede deshacer.`}
        onConfirm={ejecutarEliminacion}
        onCancel={() => setShowConfirm(false)}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}