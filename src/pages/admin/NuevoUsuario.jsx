import React from "react";
import { Container } from "react-bootstrap";
import FormRegister from "../auth/FormRegister";
import "../user/login.css";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <>
      <div className="page-wrapper">
        <h1 className="titulos-form">Nuevo Usuario </h1>
        <Container className="custom-form border rounded p-4 w-50 mb-5">
          <FormRegister fromAdmin={true} />
          <div className="mt-4 text-center">
            <div className="mt-2">
              <Link to="/admin" className="link-color text-decoration-none">
                ← Volver
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default RegisterPage;
