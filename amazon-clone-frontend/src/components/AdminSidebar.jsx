import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminSidebar.css";

const NAV_ITEMS = [
    { to: "/admin",            icon: "📊", label: "Dashboard",  end: true },
    { to: "/admin/products",   icon: "📦", label: "Products"              },
    { to: "/admin/categories", icon: "🗂️",  label: "Categories"           },
];

const AdminSidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-logo">
                <span className="admin-sidebar-logo-text">amazon</span>
                <span className="admin-sidebar-logo-tag">Admin</span>
            </div>

            <div className="admin-sidebar-user">
                <div className="admin-sidebar-avatar">
                    {user?.fullName?.[0]?.toUpperCase() ?? "A"}
                </div>
                <div>
                    <p className="admin-sidebar-name">{user?.fullName}</p>
                    <p className="admin-sidebar-role">Administrator</p>
                </div>
            </div>

            <nav className="admin-sidebar-nav">
                {NAV_ITEMS.map(({ to, icon, label, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `admin-sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="admin-sidebar-icon">{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="admin-sidebar-footer">
                <NavLink to="/products" className="admin-sidebar-link">
                    <span className="admin-sidebar-icon">🏠</span>
                    Storefront
                </NavLink>
                <button className="admin-sidebar-logout" onClick={handleLogout}>
                    <span className="admin-sidebar-icon">🚪</span>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;