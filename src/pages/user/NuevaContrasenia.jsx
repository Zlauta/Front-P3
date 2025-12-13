import React from 'react';

import { Container } from 'react-bootstrap';
import '@/style/iniciarSesion.css';
import FormNewPass from '@/pages/auth/FormularioNuevaContrasenia.jsx';

const NuevaContrasenia = () => {
  return (
    <>
      <div className="page-wrapper">
        <h1 className="titulos-form">Recuperar contraseña </h1>
        <Container className="custom-form border rounded p-4 w-100 w-md-75 w-lg-50 mb-5">
          <FormNewPass></FormNewPass>
        </Container>
      </div>
    </>
  );
};

export default NuevaContrasenia;
