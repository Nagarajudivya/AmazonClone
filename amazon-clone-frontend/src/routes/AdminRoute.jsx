// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "../styles/AdminRoute.css";
//
// const AdminRoute = ({ children }) => {
//     const { isAuthenticated, isAdmin } = useAuth();
//     const location = useLocation();
//
//     if (!isAuthenticated) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }
//
//     if (!isAdmin) {
//         return (
//             <div className="access-denied">
//                 <div className="access-denied-card">
//                     <div className="access-denied-icon">🚫</div>
//                     <h1>Access Denied</h1>
//                     <p>Admin privileges required to view this page.</p>
//                     <p className="access-denied-hint">
//                         You are logged in as a standard user. Please contact a system
//                         administrator if you need elevated access.
//                     </p>
//                     <a href="/products" className="access-denied-link">
//                         ← Back to Products
//                     </a>
//                 </div>
//             </div>
//         );
//     }
//
//     return children;
// };
//
// export default AdminRoute;


import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/products" replace />;
    }

    return children;
};

export default AdminRoute;