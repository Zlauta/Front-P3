import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Carta from "../pages/user/Carta";
import Galeria from "../pages/user/Galeria";
import SobreNosotros from "../pages/user/SobreNosotros";
import Contacto from "../pages/user/Contacto";
import Home from "../pages/user/Home";

import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import NewPassword from "../pages/user/NewPassword";
import Reservas from "../pages/user/Reservas.jsx";

const PublicRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/carta" element={<Carta />} />
      <Route path="/galeria" element={<Galeria />} />
      <Route path="/sobre-nosotros" element={<SobreNosotros />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/reservas" element={<Reservas />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password" element={<NewPassword />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PublicRoute;
