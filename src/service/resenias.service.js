import clientAxios from '@/api/clientAxios.js';

export const obtenerResenias = async () => {
  const response = await clientAxios.get('/resenias');
  return response.data.data;
};

export const crearResenia = async (data) => {
  const response = await clientAxios.post('/resenias', data);
  return response.data.data;
};

export const editarResenia = async (id, datos) => {
  const { data } = await clientAxios.put(`/resenias/${id}`, datos);
  return data;
};

export const eliminarResenia = async (id) => {
  const response = await clientAxios.delete(`/resenias/${id}`);
  return response.data.data;
};
