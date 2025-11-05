import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";


import Usuarios from "../pages/admin/Usuarios";
import Menu from "../pages/admin/Menu";
import Pedidos from "../pages/admin/Pedidos";
import Resenias from "../pages/admin/Resenias";
import Reservas from "../pages/admin/Reservas";
import Contacto from "../pages/admin/Contacto";
import Promociones from "../pages/admin/Promociones";

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/usuarios" replace />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/resenias" element={<Resenias />} />
      <Route path="/reservas" element={<Reservas />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/promociones" element={<Promociones />} />

      <Route path="*" element={<Navigate to="/admin/usuarios" replace />} />
    </Routes>
  );
};

export default AdminRoute;
