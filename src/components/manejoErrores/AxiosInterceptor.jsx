import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import clientAxios from '../api/clientAxios'; 

const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptorResponse = clientAxios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        
        if (!error.response) {
             Swal.fire({
              icon: 'error',
              title: 'Error de Conexión',
              text: 'No pudimos contactar con el servidor. Revisa tu conexión.',
              background: '#254630',
              color: '#ffffff',
              confirmButtonColor: '#1aaf4b',
              confirmButtonText: 'Reintentar'
            });
             return Promise.reject(error);
        }

        const { status } = error.response;

        switch (status) {
          case 404:
            navigate('/404');
            break;

          case 401:
            localStorage.removeItem('token');
            sessionStorage.removeItem('usuario');
            navigate('/login', { replace: true }); 
            break;

          case 403:

            Swal.fire({
              icon: 'error',
              title: 'Acceso Restringido',
              text: 'No tienes los permisos necesarios para realizar esta acción.',
              background: '#254630', 
              color: '#ffffff', 
              confirmButtonColor: '#1aaf4b',
              confirmButtonText: 'Entendido'
            });
            break;

          case 500:
            console.error('[API Error] 500 Internal Server Error');
            Swal.fire({
              icon: 'error',
              title: '¡Ups! Algo salió mal',
              text: 'Tuvimos un problema en nuestros servidores. Por favor, inténtalo más tarde.',
              background: '#254630',      
              color: '#ffffff',           
              confirmButtonColor: '#1aaf4b', 
              confirmButtonText: 'Cerrar'
            });
            break;

          default:

            break;
        }

        return Promise.reject(error);
      }
    );

    return () => {
      clientAxios.interceptors.response.eject(interceptorResponse);
    };
  }, [navigate]);

  return children;
};

export default AxiosInterceptor;