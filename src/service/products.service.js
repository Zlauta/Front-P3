import clientAxios from "../api/clientAxios.js";

export const obtenerProductos = async () => {
  try {
    const response = await clientAxios.get("/productos");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
};

export const obtenerProductoPorId = async (id) => {
  try {
    const response = await clientAxios.get(`/productos/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
  }
};

export const crearProducto = async (nuevoProducto) => {
  try {
    const response = await clientAxios.post("/productos", nuevoProducto);
    return response.data.data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
  }
};

export const actualizarProducto = async (id, productoActualizado) => {
  try {
    const response = await clientAxios.put(
      `/productos/${id}`,
      productoActualizado
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
  }
};

export const eliminarProducto = async (id) => {
  try {
    const response = await clientAxios.delete(`/productos/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
  }
};
