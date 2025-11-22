import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SidebarAdmin from "../layout/SidebarAdmin";

import Usuarios from "../pages/admin/Usuarios";
import Menu from "../pages/admin/Menu";
import Pedidos from "../pages/admin/Pedidos";
import Resenias from "../pages/admin/Resenias";
import Reservas from "../pages/admin/Reservas";
import Contacto from "../pages/admin/Contacto";
import Promociones from "../pages/admin/Promociones";
import ProtectedRoute from "./ProtectedRoute.jsx";
import NotFound from "../pages/user/NotFound.jsx";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <SidebarAdmin />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

const AdminRoute = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/usuarios" replace />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="menu" element={<Menu />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="resenias" element={<Resenias />} />
        <Route path="reservas" element={<Reservas />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="promociones" element={<Promociones />} />
      </Route>
      </Route>

      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
};

export default AdminRoute;
