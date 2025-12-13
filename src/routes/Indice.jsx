import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "@/layout/RutasAdmin.jsx";
import PublicRoute from "@/layout/RutasPublicas.jsx";
import NotFound from "@/pages/user/NoEncontrado.jsx";
import AxiosInterceptor from "@/components/manejoErrores/AxiosInterceptor.jsx";

const Index = () => {
  return (
    <BrowserRouter>
      <AxiosInterceptor>
        <Routes>
          <Route path="/404" element={<NotFound />} />

          <Route path="/admin/*" element={<AdminRoute />} />

          <Route path="/*" element={<PublicRoute />} />
        </Routes>
      </AxiosInterceptor>
    </BrowserRouter>
  );
};

export default Index;
