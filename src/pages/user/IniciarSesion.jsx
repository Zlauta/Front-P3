import React from "react";
import { Container } from "react-bootstrap";
import "@/style/iniciarSesion.css";
import { Link } from "react-router-dom";
import FormularioAcceso from "@/pages/auth/FormularioAcceso.jsx";

const IniciarSesion = () => {
  return (
    <>
      <div className="page-wrapper">
        <h1 className="titulos-form">Iniciar Sesion</h1>
        <Container className="custom-form border rounded p-4 w-100 w-md-75 w-lg-50 mb-5">
          <FormularioAcceso />
          <div className="mt-4 text-center">
            <Link to="/password" className="link-color text-decoration-none">
              Recuperar contraseña?
            </Link>
            <div className="mt-2">
              <Link to="/" className="link-color text-decoration-none">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default IniciarSesion;
