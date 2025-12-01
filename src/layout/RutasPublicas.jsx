import React from "react";
import { Routes, Route } from "react-router-dom";

import Carta from "../pages/user/Carta.jsx";
import Contacto from "../pages/user/Contacto.jsx";
import Home from "../pages/user/Inicio.jsx";

import Login from "../pages/user/IniciarSesion.jsx";
import Register from "../pages/user/Registro.jsx";
import NewPassword from "../pages/user/NuevaContrasenia.jsx";
import Reservas from "../pages/user/Reservas.jsx";
import NotFound from "../pages/user/NoEncontrado.jsx";
import Header from "../components/navegacion/Header.jsx";
import Footer from "../components/navegacion/Footer.jsx";
import Hero from "../components/Hero.jsx";

const PublicRoute = () => {
  return (
    <>
      <Header />
      <Hero />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carta" element={<Carta />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/reservas" element={<Reservas />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password" element={<NewPassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default PublicRoute;
