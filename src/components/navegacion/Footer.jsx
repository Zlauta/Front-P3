import logopng from "/images/logo.png";
import { NavLink, Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import "@/style/footer.css";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section footer-left">
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center footer-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img src={logopng} alt="El Gourmet" className="header-logo me-2" />
            <span className="brand-text">El Gourmet</span>
          </Navbar.Brand>
        </div>

        <div className="footer-section footer-center">
          <h5>Información</h5>
          <ul className="footer-nav-list">
            <li>
              <Nav.Link
                as={Link}
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Inicio
              </Nav.Link>
            </li>
            <li>
              <Nav.Link as={NavLink} to="/carta" className="footer-link">
                Carta
              </Nav.Link>
            </li>

            <li>
              <Nav.Link href="/#sobre-nosotros">Sobre Nosotros</Nav.Link>
            </li>

            <li>
              <Nav.Link href="/#resenias">Reseñas</Nav.Link>
            </li>

            <li>
              <Nav.Link as={NavLink} to="/contacto" className="footer-link">
                Contacto
              </Nav.Link>
            </li>

            <li>
              <Nav.Link as={NavLink} to="/reservas" className="footer-link">
                Reservas
              </Nav.Link>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-right">
          <h5>Seguinos en las redes</h5>
          <div className="red-social">
            <a href="https://www.facebook.com/" aria-label="Facebook">
              <img
                src="https://img.icons8.com/3d-fluency/94/facebook-logo.png"
                alt="facebook-logo"
              />
            </a>
            <a href="http://instagram.com/" aria-label="Instagram">
              <img
                src="https://img.icons8.com/3d-fluency/94/instagram-logo.png"
                alt="instagram-logo"
              />
            </a>
            <a href="https://x.com/" aria-label="Twitter/X">
              <FaXTwitter className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      <div className="grupo-2">
        <small>
          &copy;2025 - <b>El Gourmet</b> - Todos los Derechos Reservados.
        </small>
      </div>
    </footer>
  );
}
