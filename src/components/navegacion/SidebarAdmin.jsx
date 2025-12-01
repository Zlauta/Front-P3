import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Container, Offcanvas } from "react-bootstrap";
import {
  FiUsers,
  FiBookOpen,
  FiShoppingCart,
  FiStar,
  FiCalendar,
  FiMail,
  FiTag,
} from "react-icons/fi";
import "../../style/sidebar.css";

const SidebarAdmin = () => {
  return (
    <>
      <div className="sidebar-mini d-lg-none" aria-hidden="true">
      </div>

      <Navbar expand="lg" className="d-lg-none sidebar-mobile-navbar">
        <Container fluid>
          <Navbar.Toggle
            aria-controls="admin-offcanvas"
            className="sidebar-toggle"
          />
          <Navbar.Offcanvas
            id="admin-offcanvas"
            aria-labelledby="admin-offcanvas-label"
            placement="start"
            className="sidebar-offcanvas"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="admin-offcanvas-label">
                <NavLink to="/" className="brand-link">
                  <img
                    src="/images/logo.png"
                    alt="El Gourmet"
                    className="sidebar-logo"
                  />
                </NavLink>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <nav>
                <ul>
                  <li>
                    <NavLink
                      to="/admin/usuarios"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <span className="nav-icon">
                        <FiUsers />
                      </span>
                      Usuarios
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/menu"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <span className="nav-icon">
                        <FiBookOpen />
                      </span>
                      Menú
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/pedidos"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <span className="nav-icon">
                        <FiShoppingCart />
                      </span>
                      Pedidos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/resenias"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <span className="nav-icon">
                        <FiStar />
                      </span>
                      Reseñas
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/reservas"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <span className="nav-icon">
                        <FiCalendar />
                      </span>
                      Reservas
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/contacto"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <span className="nav-icon">
                        <FiMail />
                      </span>
                      Contacto
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/promociones"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <span className="nav-icon">
                        <FiTag />
                      </span>
                      Promociones
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <aside className="sidebar-admin d-none d-lg-block">
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <NavLink to="/" className="brand-link">
              <img
                src="/images/logo.png"
                alt="El Gourmet"
                className="sidebar-logo"
              />
            </NavLink>
          </div>
          <nav>
            <ul>
              <li>
                <NavLink
                  to="/admin/usuarios"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span className="nav-icon">
                    <FiUsers />
                  </span>
                  Usuarios
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/menu"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span className="nav-icon">
                    <FiBookOpen />
                  </span>
                  Menú
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/pedidos"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span className="nav-icon">
                    <FiShoppingCart />
                  </span>
                  Pedidos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/resenias"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span className="nav-icon">
                    <FiStar />
                  </span>
                  Reseñas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reservas"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span className="nav-icon">
                    <FiCalendar />
                  </span>
                  Reservas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/contacto"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span className="nav-icon">
                    <FiMail />
                  </span>
                  Contacto
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SidebarAdmin;
