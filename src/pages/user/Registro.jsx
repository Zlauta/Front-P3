import React from "react";
import { Container } from "react-bootstrap";
import FormRegister from "@/pages/auth/FormularioRegistro.jsx";
import "@/style/iniciarSesion.css";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <>
      <div className="page-wrapper">
        <h1 className="titulos-form">Registrarse </h1>
        <Container className="custom-form border rounded p-4 w-100 w-md-75 w-lg-50 mb-5">
          <FormRegister></FormRegister>
          <div className="mt-4 text-center">
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

export default RegisterPage;
