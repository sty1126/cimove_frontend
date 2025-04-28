import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = localStorage.getItem("token"); // Verifica si el token está en el almacenamiento local

  return isAuthenticated ? (
    element // Si está autenticado, renderiza el componente
  ) : (
    <Navigate to="/login" replace /> // Si no está autenticado, redirige al login
  );
};

export default PrivateRoute;
