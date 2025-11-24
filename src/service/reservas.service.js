import clientAxios from "../api/clientAxios.js";

// Manejo centralizado de errores
const manejarError = (error, mensaje) => {
  const detalle = error?.response?.data || error.message;
  console.error(`${mensaje}:`, detalle);
  throw error;
};

// Obtener todas las reservas
export const obtenerReservas = async () => {
  try {
    const { data } = await clientAxios.get("/reservas");
    return data?.data || [];
  } catch (error) {
    manejarError(error, "Error al obtener las reservas");
  }
};

// Obtener una reserva por ID
export const obtenerReservaPorId = async (id) => {
  try {
    const { data } = await clientAxios.get(`/reservas/${id}`);
    return data?.data || null;
  } catch (error) {
    manejarError(error, "Error al obtener la reserva");
  }
};

// Crear una reserva
export const crearReserva = async (nuevaReserva) => {
  try {
    const { data } = await clientAxios.post("/reservas", nuevaReserva);
    return data?.data;
  } catch (error) {
    manejarError(error, "Error al crear la reserva");
  }
};

// Actualizar reserva
export const actualizarReserva = async (id, reservaActualizada) => {
  try {
    const { data } = await clientAxios.put(
      `/reservas/${id}`,
      reservaActualizada
    );
    return data?.data;
  } catch (error) {
    manejarError(error, "Error al actualizar la reserva");
  }
};

// Eliminar reserva
export const eliminarReserva = async (id) => {
  try {
    const { data } = await clientAxios.delete(`/reservas/${id}`);
    return data?.data;
  } catch (error) {
    manejarError(error, "Error al eliminar la reserva");
  }
};
