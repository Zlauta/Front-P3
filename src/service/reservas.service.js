import clientAxios from '@/api/clientAxios.js';

const manejarError = (error, mensaje) => {
  const detalle = error?.response?.data || error.message;
  console.error(`${mensaje}:`, detalle);
  throw error;
};

export const obtenerReservas = async () => {
  try {
    const { data } = await clientAxios.get('/reservas');
    if (Array.isArray(data)) {
      return data;
    }
    return data?.data || [];
  } catch (error) {
    manejarError(error, 'Error al obtener las reservas');
    return [];
  }
};

export const obtenerReservaPorId = async (id) => {
  try {
    const { data } = await clientAxios.get(`/reservas/${id}`);
    return data?.data || null;
  } catch (error) {
    manejarError(error, 'Error al obtener la reserva');
  }
};

export const crearReserva = async (nuevaReserva) => {
  try {
    const response = await clientAxios.post('/reservas', nuevaReserva);
    return response.data;
  } catch (error) {
    manejarError(error, 'Error al crear la reserva');
  }
};

export const actualizarReserva = async (id, reservaActualizada) => {
  try {
    const { data } = await clientAxios.put(`/reservas/${id}`, reservaActualizada);
    return data?.data;
  } catch (error) {
    manejarError(error, 'Error al actualizar la reserva');
  }
};

export const eliminarReserva = async (id) => {
  try {
    const { data } = await clientAxios.delete(`/reservas/${id}`);
    return data?.data;
  } catch (error) {
    manejarError(error, 'Error al eliminar la reserva');
  }
};

export const obtenerMisReservas = async (email, fechaDesde) => {
  try {
    const { data } = await clientAxios.get('/reservas/mis', {
      params: { email, fecha: fechaDesde },
    });

    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    manejarError(error, 'Error al obtener mis reservas');
    return [];
  }
};
