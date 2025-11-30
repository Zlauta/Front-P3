import clientAxios from "../api/clientAxios.js";

export const loginUser = async ({ email, password }) => {
  try {
    const response = await clientAxios.post(`/usuarios/login`, {
      email: email,
      contrasenia: password,
    });
    
    const token = response.data?.token;
    const usuario = response.data?.payload;
    if (token) {
      localStorage.setItem("token", token);
   
      const emailGuardar = usuario?.email || email;
      localStorage.setItem("userEmail", emailGuardar);

      sessionStorage.setItem("usuario", JSON.stringify(usuario));
    }
      
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || { msg: "Error desconocido" };
  }
};