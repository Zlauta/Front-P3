 import React from "react";
 import { Routes, Route, Navigate } from "react-router-dom";


 import Reservas from "../pages/user/Reservas";

 const ProtectedRoute = () => {
   return (
     <Routes>

       <Route path="/" element={<Reservas />} />
       <Route path="*" element={<Navigate to="/reservas" replace />} />
     </Routes>
   );
 };

 export default ProtectedRoute;
