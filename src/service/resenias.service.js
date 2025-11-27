import clientAxios from '../api/clientAxios';

export const obtenerResenias = async () => {
  const response = await clientAxios.get('/resenias');
  return response.data;
};

export const crearResenia = async (data) => {
  const response = await clientAxios.post('/resenias', data);
  return response.data;
};

export const cambiarEstadoResenia = async (id, estadoActual) => {
  const response = await clientAxios.put(`/resenias/${id}`, { 
    activo: !estadoActual 
  });
  return response.data;
};

export const eliminarResenia = async (id) => {
  const response = await clientAxios.delete(`/resenias/${id}`);
  return response.data;
};