import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "@/style/carruselResenia.css";
import ModalCreateResenia from "./CrearReseniaModal.jsx";

const CarruselResenia = ({ resenias = [], updateList }) => {
  const [showModal, setShowModal] = useState(false);

  const reseniasActivas = Array.isArray(resenias)
    ? resenias.filter((resenia) => resenia.activo === true)
    : [];

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="py-3 position-relative">
      <h2 className="text-center text-white mb-4">
        Lo que dicen nuestros clientes
      </h2>

      {reseniasActivas.length > 0 ? (
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          showDots={false}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {reseniasActivas.map((resenia) => {
            const estrellas = resenia.calificacion
              ? parseInt(resenia.calificacion)
              : 0;

            return (
              <div key={resenia._id} className="h-100 pb-2 px-2">
                <Card className="resenia-card text-center h-100">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <FaQuoteLeft
                      size={30}
                      color="#1aaf4b"
                      className="mb-3 opacity-50"
                    />

                    <Card.Text className="resenia-comentario fst-italic">
                      "{resenia.comentario}"
                    </Card.Text>

                    <div className="mt-auto pt-3">
                      <div className="mb-2">
                        {[...Array(estrellas)].map((_, i) => (
                          <FaStar key={i} color="#ffc107" size={20} />
                        ))}
                      </div>
                      <Card.Title
                        className="resenia-user fw-bold"
                        style={{ fontSize: "1.2rem", color: "#1aaf4b" }}
                      >
                        - {resenia.nombre}
                      </Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </Carousel>
      ) : (
        <div
          className="text-center text-white p-5 mx-auto"
          style={{
            backgroundColor: "#254630",
            borderRadius: "15px",
            maxWidth: "600px",
          }}
        >
          <p className="mb-0 fs-5">¡Sé el primero en dejar una reseña!</p>
        </div>
      )}

      <div className="text-center mt-5">
        <Button
          variant="outline-light"
          onClick={() => setShowModal(true)}
          style={{
            borderRadius: "20px",
            fontWeight: "bold",
            borderWidth: "2px",
            padding: "8px 20px",
          }}
        >
          Dejar una reseña
        </Button>
      </div>

      <ModalCreateResenia
        show={showModal}
        handleClose={() => setShowModal(false)}
        updateList={updateList}
      />
    </div>
  );
};

export default CarruselResenia;
