import React from 'react';
import { Card } from 'react-bootstrap';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import './CarruselResenia.css'; 

const CarruselResenia = ({ resenias = [] }) => {
  
  const reseniasActivas = Array.isArray(resenias)
    ? resenias.filter((r) => r.activo === true)
    : [];

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="py-3">
      <h2 className="text-center text-white mb-5">
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
              <div key={resenia._id} className="h-100 pb-2">
                {/* 👇 Usamos className "resenia-card" */}
                <Card className="resenia-card text-center">
                  
                  <FaQuoteLeft size={30} color="#1aaf4b" className="mb-3 opacity-50" />
                  
                  {/* 👇 Usamos className "resenia-comentario" */}
                  <Card.Text className="resenia-comentario">
                    "{resenia.comentario}"
                  </Card.Text>
                  
                  <div className="mt-2">
                    {[...Array(estrellas)].map((_, i) => (
                      <FaStar key={i} color="#ffc107" size={20} />
                    ))}
                  </div>
                  
                  {/* 👇 Usamos className "resenia-user" */}
                  <Card.Title className="resenia-user">
                    - {resenia.nombre}
                  </Card.Title>

                </Card>
              </div>
            );
          })}
        </Carousel>
      ) : (
        <div className="text-center text-white p-5" style={{ backgroundColor: "#254630", borderRadius: "15px" }}>
          <p className="mb-0">Aún no hay reseñas visibles.</p>
        </div>
      )}
    </div>
  );
};

export default CarruselResenia;