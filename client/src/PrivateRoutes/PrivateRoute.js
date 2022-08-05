import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children, roles, userRole, ...rest }) => {
  return roles.includes(userRole) ? children : <Navigate to="/" />;
};

export const PrivateOutlet = ({ roles, userRole }) => {
  return roles.includes(userRole) ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
