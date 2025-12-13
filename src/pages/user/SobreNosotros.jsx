import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Card, Container, Image } from "react-bootstrap";
import "@/style/sobreNosotros.css";

export const SobreNosotros = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  const miembros = [
    {
      id: 1,
      nombre: "Nadia Medina",
      rol: "Scrum Master",
      img: "/images/personaMujer.svg",
    },

    {
      id: 2,
      nombre: "Lautaro Zarate",
      rol: "Desarrollador Full Stack",
      img: "/images/personaHombre.svg",
    },
    {
      id: 3,
      nombre: "Amelia Antoni",
      rol: "Desarrolladora Full Stack",
      img: "/images/personaMujer.svg",
    },
    {
      id: 4,
      nombre: "Felipe Marrone",
      rol: "Desarrollador Full Stack",
      img: "/images/personaHombre.svg",
    },
    {
      id: 5,
      nombre: "Matias Soria",
      rol: "Desarrollador Full Stack",
      img: "/images/personaHombre.svg",
    },
  ];

  return (
    <Container fluid className="sobre-container">
      <div data-aos="fade-up" className="text-center mb-5">
        <h1 className="text-light">DevFusion</h1>
        <h3 className="text-light">
          Conoce al equipo detrás de nuestro proyecto
        </h3>
        <h5 className="text-light">
          Unidos por la pasión de crear soluciones innovadoras
        </h5>
      </div>
      {miembros.map((miembro, i) => (
        <Card
          key={miembro.id}
          className="about-card"
          data-aos=""
          data-aos-delay={i * 120}
          style={{
            ["--initX"]: i % 2 === 0 ? `-130%` : `130%`,
            ["--initY"]: `120%`,
            ["--rot"]: `${i % 2 === 0 ? -8 : 8}deg`,
            alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
          }}
        >
          <Card.Body>
            <div className="card-head">
              <Image
                src={miembro.img}
                alt={miembro.nombre}
                className="member-img"
                roundedCircle
              />
              <div>
                <div className="name text-center">{miembro.nombre}</div>
                <div className="role text-center">{miembro.rol}</div>
              </div>
            </div>

            <div>
              <div
                className="social-links"
                style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}
              >
                {miembro.social?.instagram && (
                  <a
                    href={miembro.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "white" }}
                  >
                    <img
                      width="48"
                      height="48"
                      src="https://img.icons8.com/color/48/instagram-new--v1.png"
                      alt="instagram-new--v1"
                    />
                  </a>
                )}
                {miembro.social?.facebook && (
                  <a
                    href={miembro.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "white" }}
                  >
                    <img
                      width="48"
                      height="48"
                      src="https://img.icons8.com/color/48/facebook-new.png"
                      alt="facebook-new"
                    />
                  </a>
                )}
                {miembro.social?.github && (
                  <a
                    href={miembro.social.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "white" }}
                  >
                    <img
                      width="48"
                      height="48"
                      src="https://img.icons8.com/color/48/github--v1.png"
                      alt="github--v1"
                    />
                  </a>
                )}
                {miembro.social?.whatsapp && (
                  <a
                    href={miembro.social.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "white" }}
                  >
                    <img
                      width="48"
                      height="48"
                      src="https://img.icons8.com/color/48/whatsapp--v1.png"
                      alt="whatsapp--v1"
                    />
                  </a>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default SobreNosotros;
