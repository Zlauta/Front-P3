import { useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FaTable } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '@/index.css';
import '@/api/clientAxios.js';
import {
  actualizarContacto,
  obtenerContactos,
  eliminarContacto,
  responderContacto,
} from '@/service/contacto.service.js';
import ConfirmModal from '@/components/ui/ConfirmModal.jsx';
import { FiGrid } from 'react-icons/fi';
import ContactoGrid from '@/components/adminContacto/ContactoGrid.jsx';
import ContactoTabla from '@/components/adminContacto/ContactoTabla.jsx';
import ResponderModal from '@/components/adminContacto/ResponderModal.jsx';

export default function Contactos() {
  const [contactos, setContactos] = useState([]);
  const [ediciones, setEdiciones] = useState({});
  const [vista, setVista] = useState('grid');

  // Estados para Eliminar
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState({ id: null });

  // Estados para Responder Email
  const [showReply, setShowReply] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null); // Guarda el objeto contacto seleccionado

  // --- 1. CARGA DE DATOS ---
  const cargar = async () => {
    try {
      const data = await obtenerContactos();
      setContactos(data);
    } catch (error) {
      console.error('Error al cargar contactos:', error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // --- 2. LOGICA EDICION ESTADO ---
  const manejarEstado = (id, valor) => {
    setEdiciones((prev) => ({ ...prev, [id]: { ...prev[id], estado: valor } }));
  };

  const guardarCambios = async (id) => {
    const cambios = ediciones[id];
    if (!cambios) return;
    try {
      await actualizarContacto(id, cambios);
      await cargar();
      setEdiciones((prev) => {
        const copia = { ...prev };
        delete copia[id];
        return copia;
      });
      Swal.fire({
        title: 'Contacto actualizado!',
        icon: 'success',
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        timer: 1200,
        showConfirmButton: false,
        customClass: { popup: 'small-alert' },
      });
    } catch (error) {
      Swal.fire({ title: 'Error al actualizar', icon: 'error', confirmButtonColor: '#1aaf4b' });
    }
  };

  // --- 3. LOGICA ELIMINAR ---
  const confirmarEliminacion = (id) => {
    setConfirmTarget({ id });
    setShowConfirm(true);
  };
  const ejecutarEliminacion = async () => {
    setShowConfirm(false);
    try {
      await eliminarContacto(confirmTarget.id);
      await cargar();
      Swal.fire({
        title: 'Contacto eliminado',
        icon: 'success',
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        timer: 1200,
        showConfirmButton: false,
        customClass: { popup: 'small-alert' },
      });
    } catch (error) {
      Swal.fire({ title: 'Error al eliminar', icon: 'error', confirmButtonColor: '#1aaf4b' });
    }
  };

  // --- 4. LOGICA RESPONDER EMAIL (NUEVA) ---
  const abrirModalRespuesta = (contacto) => {
    setReplyTarget(contacto);
    setShowReply(true);
  };

  const enviarRespuesta = async (datosEmail) => {
    try {
      // Llamamos al servicio
      const datosCompletos = {
        ...datosEmail,
        nombre: replyTarget.nombre,
      };
      await responderContacto(replyTarget.email, datosCompletos);

      if (replyTarget.estado === 'pendiente') {
        await actualizarContacto(replyTarget._id, { estado: 'resuelto' });
        await cargar();
      }

      Swal.fire({
        title: 'Correo enviado',
        text: `Se envió la respuesta a ${replyTarget.email}`,
        icon: 'success',
        confirmButtonColor: '#1aaf4b',
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error al enviar',
        text: 'Hubo un problema con el servidor de correo.',
        icon: 'error',
        confirmButtonColor: '#1aaf4b',
      });
    }
  };

  const commonProps = {
    contactos,
    ediciones,
    onEstadoChange: manejarEstado,
    onGuardar: guardarCambios,
    onEliminar: confirmarEliminacion,
    onResponder: abrirModalRespuesta, // Pasamos la nueva función
  };

  return (
    <div className="p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 mt-4">
        <h3 className="text-light fs-1 m-0">Contactos recibidos</h3>
        <div className="d-flex gap-3 align-items-center mt-3 mt-md-0">
          <ButtonGroup>
            <Button
              variant={vista === 'grid' ? 'success' : 'outline-secondary'}
              onClick={() => setVista('grid')}
            >
              <FiGrid />
            </Button>
            <Button
              variant={vista === 'table' ? 'success' : 'outline-secondary'}
              onClick={() => setVista('table')}
            >
              <FaTable />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {contactos.length === 0 ? (
        <div className="text-center text-light py-5 border rounded bg-dark">
          <h4>No hay contactos registrados aún.</h4>
        </div>
      ) : vista === 'grid' ? (
        <ContactoGrid {...commonProps} />
      ) : (
        <ContactoTabla {...commonProps} />
      )}

      <div className="text-light fs-5 mt-4 text-end">
        Total: {contactos.length} contacto{contactos.length === 1 ? '' : 's'}
      </div>

      {/* MODAL DE ELIMINAR */}
      <ConfirmModal
        show={showConfirm}
        title={`¿Eliminar contacto?`}
        text={`Esta acción no se puede deshacer.`}
        onConfirm={ejecutarEliminacion}
        onCancel={() => setShowConfirm(false)}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />

      {/* MODAL DE RESPONDER EMAIL (NUEVO) */}
      <ResponderModal
        show={showReply}
        onHide={() => setShowReply(false)}
        destinatario={replyTarget}
        onSend={enviarRespuesta}
      />
    </div>
  );
}
