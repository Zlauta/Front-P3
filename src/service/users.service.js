import clientAxios from "../api/clientAxios.js";

export const obtenerUsuarios = async () => {
  try {
    const response = await clientAxios.get("/usuarios");
    return response.data.usuarios;
  } catch (error) {
    console.error(
      "Error al recuperar los usuarios de la base de datos:",
      error
    );
    throw error;
  }
};

export const actualizarUsuario = async (id, usuarioActualizado) => {
  try {
    const response = await clientAxios.put(
      `/usuarios/${id}`,
      usuarioActualizado
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

export const eliminarUsuario = async (id) => {
  try {
    const response = await clientAxios.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

export const registrarUsuario = async (nuevoUsuario) => {
  try {
    const response = await clientAxios.post("usuarios/registro", nuevoUsuario);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};
