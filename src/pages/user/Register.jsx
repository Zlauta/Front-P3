import React from "react";
import { Container } from "react-bootstrap";
import FormRegister from "../auth/FormRegister";
import "./login.css";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <>
      <h1 className="titulos-form">Registrarse </h1>
      <Container className="custom-form border rounded p-4 w-50 mb-5">
        <FormRegister></FormRegister>
        <div className="mt-4 text-center">
          <div className="mt-2">
            <Link to="/" className="link-color text-decoration-none">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};

export default RegisterPage;
