import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import SidebarAdmin from '@/components/navegacion/SidebarAdmin.jsx';

import Usuarios from '@/pages/admin/Usuarios.jsx';
import Menu from '@/pages/admin/Menu.jsx';
import Pedidos from '@/pages/admin/Pedidos.jsx';
import Resenias from '@/pages/admin/Resenias.jsx';
import Reservas from '@/pages/admin/Reservas.jsx';
import Contacto from '@/pages/admin/Contacto.jsx';
import ProtectedRoute from '@/routes/RutasProtegidas.jsx';
import NotFound from '@/pages/user/NoEncontrado.jsx';

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
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>

  );
};

export default AdminRoute;
