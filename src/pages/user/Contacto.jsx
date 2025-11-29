import React from "react";
import { Container } from "react-bootstrap";
import "./login.css";
import { Link } from "react-router-dom";
import FormContacto from "../auth/FormContacto";
import Header from "../../layout/Header";

const Contacto = () => {
  return (
    <>
      <div className="page-wrapper">
        <h1 className="titulos-form">Escribinos tu consulta </h1>
        <Container className="custom-form border rounded p-4 w-100 w-md-75 w-lg-50 mb-5">
          <FormContacto></FormContacto>
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

export default Contacto;
