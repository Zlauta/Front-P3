import React from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import SidebarAdmin from "@/components/navegacion/SidebarAdmin.jsx";

import Usuarios from "@/pages/admin/Usuarios.jsx";
import Menu from "@/pages/admin/Menu.jsx";
import Pedidos from "@/pages/admin/Pedidos.jsx";
import Resenias from "@/pages/admin/Resenias.jsx";
import Reservas from "@/pages/admin/Reservas.jsx";
import Contacto from "@/pages/admin/Contacto.jsx";
import ProtectedRoute from "@/routes/RutasProtegidas.jsx";
import NotFound from "@/pages/user/NoEncontrado.jsx";

const AdminLayout = () => {
  const navigate = useNavigate();

  function logout() {
    Swal.fire({
      title: "¿Estás seguro de cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Salir",
      iconColor: "#1aaf4b",
      confirmButtonColor: "#1aaf4b",
      cancelButtonColor: "#254630",
      customClass: { popup: "small-alert" },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Sesión cerrada!",
          icon: "success",
          iconColor: "#254630",
          confirmButtonColor: "#1aaf4b",
          customClass: { popup: "small-alert" },
          timer: 1200,
          showConfirmButton: false,
        });

        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        sessionStorage.removeItem("usuario");

        navigate("/");
      }
    });
  }
  return (
    <div className="admin-layout d-flex">
      <SidebarAdmin />
      <div className="flex-grow-1">
        <div className="d-flex justify-content-end p-2">
          <Button variant="success" onClick={logout} className="ms-2 me-3">
            Salir
          </Button>
        </div>
        <main className="admin-content p-3">
          <Outlet />
        </main>
      </div>
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
