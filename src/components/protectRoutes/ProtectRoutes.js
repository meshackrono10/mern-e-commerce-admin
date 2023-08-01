import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userAdmin = localStorage.getItem("userInfo");
  const admin = JSON.parse(userAdmin);
  const isAdmin = admin?.isAdmin === true;

  let location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
