import clientAxios from '@/api/clientAxios.js';

export const enviarCorreo = async (correoData) => {
  try {
    const response = await clientAxios.post('/correo', correoData);
    return response.data.data;
  } catch (error) {
    console.error('Error al enviar correo para confirmar reserva:', error);
    throw error;
  }
};
