import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  actualizarReserva,
  eliminarReserva,
  obtenerMisReservas,
} from '@/service/reservas.service.js';
import '@/index.css';
import { validarCapacidadMesa, validarHorarioAtencion } from '@/utils/reservasUtil.js';
import ReservasClienteGrid from '@/components/userReservas/ReservasClienteGrid.jsx';
import EditarReservaModal from '@/components/userReservas/EditarReservaModal.jsx';

export default function MisReservas({ reloadFlag }) {
  const [reservas, setReservas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  const cargarDatos = async () => {
    try {
      const usuario = JSON.parse(sessionStorage.getItem('usuario'));
      const correoUsuario = usuario?.email;
      const hoy = new Date().toISOString().split('T')[0];

      const datos = await obtenerMisReservas(correoUsuario, hoy);
      const reservasOrdenadas = datos.sort((a, b) => {
        const dateA = new Date(`${a.fecha.split('T')[0]}T${a.hora}`);
        const dateB = new Date(`${b.fecha.split('T')[0]}T${b.hora}`);
        return dateA - dateB;
      });

      setReservas(reservasOrdenadas);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error al cargar reservas',
        icon: 'error',
        confirmButtonColor: '#1aaf4b',
      });
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [reloadFlag]);

  const abrirModal = (reserva) => {
    setReservaSeleccionada(reserva);
    setMostrarModal(true);
  };

  const guardarCambios = async (datosEditados) => {
    const { fecha, hora, mesa, cantidadPersonas, _id } = datosEditados;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (new Date(fecha + 'T00:00:00') < hoy) {
      return Swal.fire({
        title: 'La fecha no puede ser anterior a hoy',
        icon: 'warning',
        confirmButtonColor: '#1aaf4b',
      });
    }

    const errHorario = validarHorarioAtencion(hora);
    if (errHorario)
      return Swal.fire({ title: errHorario, icon: 'warning', confirmButtonColor: '#1aaf4b' });

    const errCapacidad = validarCapacidadMesa(mesa, cantidadPersonas);
    if (errCapacidad)
      return Swal.fire({ title: errCapacidad, icon: 'warning', confirmButtonColor: '#1aaf4b' });

    try {
      await actualizarReserva(_id, datosEditados);
      await cargarDatos();
      setMostrarModal(false);
      Swal.fire({
        title: 'Reserva actualizada',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: error.response?.data?.message || 'Error al actualizar',
        icon: 'error',
        confirmButtonColor: '#1aaf4b',
      });
    }
  };
  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Cancelar Reserva?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
    });

    if (!result.isConfirmed) return;

    try {
      await eliminarReserva(id);
      await cargarDatos();
      Swal.fire({
        title: 'Reserva cancelada',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({ title: 'Error al cancelar', icon: 'error', confirmButtonColor: '#1aaf4b' });
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-light fs-1 mt-5 mb-5 text-center">Mis Reservas</h3>

      {reservas.length === 0 ? (
        <div
          className="text-center text-light py-5 border rounded bg-dark mx-auto"
          style={{ maxWidth: '600px' }}
        >
          <p className="fs-4">No tienes reservas pendientes.</p>
          <p className="fs-5 text-success">¡Haz tu primera reserva hoy!</p>
        </div>
      ) : (
        <ReservasClienteGrid reservas={reservas} onEditar={abrirModal} onEliminar={eliminar} />
      )}
      <EditarReservaModal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        reserva={reservaSeleccionada}
        onGuardar={guardarCambios}
      />
    </div>
  );
}
