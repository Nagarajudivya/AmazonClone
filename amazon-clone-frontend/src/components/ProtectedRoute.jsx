import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// requireAdmin=true guards routes that map to backend endpoints requiring ROLE_ADMIN
// (product create/edit, since SecurityConfig restricts those to hasRole("ADMIN")).
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/products" replace />;
    }

    return children;
};

export default ProtectedRoute;