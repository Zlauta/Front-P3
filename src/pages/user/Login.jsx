import React from "react";
import FormLogin from "../auth/FormLogin";
import { Container } from "react-bootstrap";
import "./login.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="page-wrapper">
        <h1 className="titulos-form">Iniciar Sesion</h1>
        <Container className="custom-form border rounded p-4 w-50 mb-5">
          <FormLogin></FormLogin>
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

export default Login;
