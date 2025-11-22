import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import PublicRoute from "./PublicRoute";
import NotFound from "../pages/user/NotFound.jsx";



const Index = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/404" element={<NotFound />} />

        <Route path="/admin/*" element={<AdminRoute />} />

        <Route path="/*" element={<PublicRoute />} />


      </Routes>
    </BrowserRouter>
  );
};

export default Index;
