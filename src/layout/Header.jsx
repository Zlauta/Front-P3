import React from "react";
import { ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import "./header.css";
import logopng from "/images/logo.png";

const Header = () => {
  return (
    <header>
      <Navbar expand="lg" className="header-navbar" variant="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img src={logopng} alt="El Gourmet" className="header-logo me-2" />
            <span className="brand-text">El Gourmet</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto mb-2 mb-lg-0 align-items-lg-center">
              <Nav.Link as={Link} to="/">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/carta">
                Carta
              </Nav.Link>
              <Nav.Link href="#galeria" className="scroll">
                Galería
              </Nav.Link>
              <Nav.Link href="#sobre-nosotros" className="scroll">
                Sobre Nosotros
              </Nav.Link>
              <Nav.Link
                href="#resenias" className="scroll"
              >
                Reseñas
              </Nav.Link>
              <Nav.Link as={Link} to="/contacto">
                Contacto
              </Nav.Link>
              <Button as={Link} to="/reservas" className="btn-cta ms-lg-3">
                Reservar
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
