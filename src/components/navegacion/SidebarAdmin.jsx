import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Container, Offcanvas, Button } from 'react-bootstrap';
import {
  FiUsers,
  FiBookOpen,
  FiShoppingCart,
  FiStar,
  FiCalendar,
  FiMail,
  FiTag,
} from 'react-icons/fi';
import '@/style/sidebar.css';
import Swal from 'sweetalert2';
import { FaWindowClose } from 'react-icons/fa';

const SidebarAdmin = () => {
  const navigate = useNavigate();

  function logout() {
    Swal.fire({
      title: '¿Estás seguro de cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Salir',
      iconColor: '#1aaf4b',
      confirmButtonColor: '#1aaf4b',
      cancelButtonColor: '#254630',
      customClass: { popup: 'small-alert' },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Sesión cerrada!',
          icon: 'success',
          iconColor: '#254630',
          confirmButtonColor: '#1aaf4b',
          customClass: { popup: 'small-alert' },
          timer: 1200,
          showConfirmButton: false,
        });

        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('usuario');

        navigate('/');
      }
    });
  }
  return (
    <>
      <div className="sidebar-mini d-lg-none" aria-hidden="true"></div>

      <Navbar expand="lg" className="d-lg-none sidebar-mobile-navbar">
        <Container fluid>
          <Navbar.Toggle aria-controls="admin-offcanvas" className="sidebar-toggle" />
          <Navbar.Offcanvas
            id="admin-offcanvas"
            aria-labelledby="admin-offcanvas-label"
            placement="start"
            className="sidebar-offcanvas"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="admin-offcanvas-label">
                <div className="brand-link">
                  <img src="/images/logo.png" alt="El Gourmet" className="sidebar-logo" />
                </div>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <nav>
                <ul>
                  <li>
                    <NavLink
                      to="/admin/usuarios"
                      className={({ isActive }) => (isActive ? 'active' : '')}
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
                      className={({ isActive }) => (isActive ? 'active' : '')}
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
                      className={({ isActive }) => (isActive ? 'active' : '')}
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
                      className={({ isActive }) => (isActive ? 'active' : '')}
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
                      className={({ isActive }) => (isActive ? 'active' : '')}
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
                      className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                      <span className="nav-icon">
                        <FiMail />
                      </span>
                      Contacto
                    </NavLink>
                  </li>
                </ul>
              </nav>
              <div>
                <Button variant="outline-danger" className="mt-5 w-100" onClick={logout}>
                 <FaWindowClose className="me-2 mb-1" />
                  Cerrar sesión
                </Button>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <aside className="sidebar-admin d-none d-lg-block">
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <div className="sidebar-brand">
              <div className="brand-link">
                <img src="/images/logo.png" alt="El Gourmet" className="sidebar-logo" />
              </div>
            </div>
          </div>
          <nav>
            <ul>
              <li>
                <NavLink
                  to="/admin/usuarios"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <span className="nav-icon">
                    <FiUsers />
                  </span>
                  Usuarios
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/menu" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <span className="nav-icon">
                    <FiBookOpen />
                  </span>
                  Menú
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/pedidos"
                  className={({ isActive }) => (isActive ? 'active' : '')}
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
                  className={({ isActive }) => (isActive ? 'active' : '')}
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
                  className={({ isActive }) => (isActive ? 'active' : '')}
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
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <span className="nav-icon">
                    <FiMail />
                  </span>
                  Contacto
                </NavLink>
              </li>
            </ul>
          </nav>
          <div>
            <Button variant="outline-danger" className="mt-5 w-100" onClick={logout}>
              <FaWindowClose className="me-2 mb-1" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarAdmin;
