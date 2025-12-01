import React, { useState, useEffect } from 'react';
import '../style/hero.css';
const imagenesHero = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop"  
];

const DURACION_SLIDE = 5000;

const Hero = () => {
    const [indiceActual, setIndiceActual] = useState(0);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setIndiceActual((indiceAnterior) => 
                (indiceAnterior + 1) % imagenesHero.length
            );
        }, DURACION_SLIDE);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <section className="hero-seccion">
            
            {/* Carrusel de imágenes */}
            {imagenesHero.map((urlImagen, indice) => (
                <div 
                    key={indice}
                    // Lógica condicional: Si es la imagen actual, agrega la clase 'hero-activa'
                    className={`hero-imagen-fondo ${indice === indiceActual ? 'hero-activa' : ''}`}
                    style={{ backgroundImage: `url(${urlImagen})` }}
                />
            ))}

            {/* Capa oscura */}
            <div className="hero-overlay"></div>

            {/* Contenido */}
            <div className="hero-contenido">
                <h1 className="hero-titulo">
                    Arte Culinario en Cada Bocado.
                </h1>
                <p className="hero-subtitulo">
                    Descubre una experiencia gastronómica inolvidable donde la tradición se encuentra con la innovación.
                </p>
            </div>
        </section>
    );
};

export default Hero;