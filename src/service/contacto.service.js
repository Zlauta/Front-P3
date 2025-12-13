import clientAxios from "@/api/clientAxios.js";

export const obtenerContactos = async () => {
  try {
    const response = await clientAxios.get("/contacto");
    return response.data.data; /// response.data.contacto  ??
  } catch (error) {
    console.error(
      "Error al recuperar los contactos de la base de datos:",
      error
    );
    throw error;
  }
};

export const actualizarContacto = async (id, contactoActualizado) => {
  try {
    const response = await clientAxios.put(
      `/contacto/${id}`,
      contactoActualizado
    );
    return response.data.data; //   response.data;
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    throw error;
  }
};

export const crearContacto = async (nuevoContacto) => {
  try {
    const response = await clientAxios.post("contacto", nuevoContacto);
    return response.data.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const eliminarContacto = async (id) => {
  try {
    const response = await clientAxios.delete(`/contacto/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};
