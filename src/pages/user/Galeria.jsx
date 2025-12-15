import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Container } from 'react-bootstrap';
import '@/style/galeria.css';

export const Galeria = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const images = [
    '/images/CazuelaDeMariscos.jpg',
    '/images/negroni.jpg',
    '/images/merluzaEnPapillote.jpg',
    '/images/paella.jpg',
    '/images/saltimbocca.webp',
    '/images/strudelDeManzana.jpg',
    '/images/ginTonic.jpg',
    '/images/ojoDeBife.jpg',
    '/images/volcanDeChocolate.jpg',
    '/images/solomilloWellington.png',
    '/images/sorentinos.jpg',
    '/images/panaCotta.jpg',
    '/images/EnsaladaCesar.webp',
  ];

  return (
    <Container className="py-5">
      <div data-aos="fade-up" className="text-center mb-5">
        {/* <h1 className="text-light">Galería</h1> */}
        <h3 className="text-light">Nuestros Platos Estrellas</h3>
      </div>
      <div className="masonry">
        {images.map((src, i) => (
          <div key={i} className="masonry-item" data-aos="fade-up">
            <img src={src} alt={`img-${i}`} className="masonry-img" />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Galeria;
