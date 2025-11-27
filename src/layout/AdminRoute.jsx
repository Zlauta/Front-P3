import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SidebarAdmin from "../components/navegacionAdmin/SidebarAdmin.jsx";

import Usuarios from "../pages/admin/Usuarios.jsx";
import Menu from "../pages/admin/Menu.jsx";
import Pedidos from "../pages/admin/Pedidos.jsx";
import Resenias from "../pages/admin/Resenias.jsx";
import Reservas from "../pages/admin/Reservas.jsx";
import Contacto from "../pages/admin/Contacto.jsx";
import Promociones from "../pages/admin/Promociones.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoute;
