import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import "../../style/header.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import logopng from "/images/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("usuario")) || null;
  const isActiveUser = user && user.estado === "activo";

  function logout() {
    Swal.fire({
      title: "¿Estás seguro de cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Salir",
      iconColor: "#1aaf4b",
      confirmButtonColor: "#1aaf4b",
      cancelButtonColor: "#254630",
      customClass: {
        popup: "small-alert",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Sesión cerrada!",
          icon: "success",
          iconColor: "#254630",
          confirmButtonColor: "#1aaf4b",
          customClass: {
            popup: "small-alert",
          },
          timer: 1200,
          showConfirmButton: false,
        });

        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        sessionStorage.removeItem("usuario");

        navigate("/");
      }
    });
  }

  return (
    <header>
      <Navbar
        expand="lg"
        className="header-navbar"
        variant="dark"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img src={logopng} alt="El Gourmet" className="header-logo me-2" />
            <span className="brand-text">El Gourmet</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto mb-2 mb-lg-0 align-items-lg-center">
              <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                Inicio
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/carta"
                onClick={() => setExpanded(false)}
              >
                Carta
              </Nav.Link>
              <Nav.Link
                href="/#galeria"
                className="scroll"
                onClick={() => setExpanded(false)}
              >
                Galería
              </Nav.Link>
              <Nav.Link
                href="/#sobre-nosotros"
                className="scroll"
                onClick={() => setExpanded(false)}
              >
                Sobre Nosotros
              </Nav.Link>
              <Nav.Link
                href="/#resenias"
                className="scroll"
                onClick={() => setExpanded(false)}
              >
                Reseñas
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contacto"
                onClick={() => setExpanded(false)}
              >
                Contacto
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/reservas"
                onClick={() => setExpanded(false)}
              >
                Reservas
              </Nav.Link>
              {isActiveUser ? (
                <>
                  {user.rol === "admin" && (
                    <Nav.Link
                      as={Link}
                      to="/admin"
                      onClick={() => setExpanded(false)}
                    >
                      Admin
                    </Nav.Link>
                  )}

                  <Button variant="success" onClick={logout} className="ms-2">
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    className="btn-cta ms-lg-3"
                    onClick={() => setExpanded(false)}
                  >
                    Iniciar Sesion
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
