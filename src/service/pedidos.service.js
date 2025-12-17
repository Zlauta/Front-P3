import clientAxios from '@/api/clientAxios.js';

export const crearPedido = async (nuevoPedido) => {
  try {
    const response = await clientAxios.post('/pedidos', nuevoPedido);
    return response.data;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

export const obtenerPedidos = async () => {
  try {
    const response = await clientAxios.get('/pedidos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

export const obtenerPedidoPorId = async (id) => {
  try {
    const response = await clientAxios.get(`/pedidos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pedido por ID:', error);
    throw error;
  }
};

export const actualizarEstadoPedido = async (id, nuevoEstado) => {
  try {
    const response = await clientAxios.patch(`/pedidos/${id}/estado`, {
      estado: nuevoEstado,
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw error;
  }
};

export const eliminarPedido = async (id) => {
  try {
    const response = await clientAxios.delete(`/pedidos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    throw error;
  }
};
