import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";


const Index = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/admin/*" element={<AdminRoute />} />


        <Route path="/reservas/*" element={<ProtectedRoute />} />


        <Route path="/*" element={<PublicRoute />} />


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Index;
