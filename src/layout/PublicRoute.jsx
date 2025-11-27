import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Carta from "../pages/user/Carta.jsx";
import Galeria from "../pages/user/Galeria.jsx";
import SobreNosotros from "../pages/user/SobreNosotros.jsx";
import Contacto from "../pages/user/Contacto.jsx";
import Home from "../pages/user/Home.jsx";

import Login from "../pages/user/Login.jsx";
import Register from "../pages/user/Register.jsx";
import NewPassword from "../pages/user/NewPassword.jsx";
import Reservas from "../pages/user/Reservas.jsx";
import NotFound from "../pages/user/NotFound.jsx";
import Header from "../components/navegacionUser/Header.jsx";
import Footer from "../components/navegacionUser/Footer.jsx";

const PublicRoute = () => {
  return (
    <>
      <Header />
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
