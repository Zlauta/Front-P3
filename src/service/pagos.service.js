import clientAxios from '@/api/clientAxios.js'; // <--- CHEQUEA ESTA RUTA

export const crearPreferenciaPago = async (datosPedido) => {
  try {
    const { data } = await clientAxios.post('/pagos/crear-preferencia', datosPedido);
    return data;
  } catch (error) {
    console.error('Error en pagos:', error);
    const mensajeError =
      error.response?.data?.mensaje || error.response?.data?.msg || 'Error al procesar el pago';
    throw new Error(mensajeError);
  }
};
