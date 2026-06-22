import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import adminService from "../services/adminService";
import Loader from "../components/Loader";
import "../styles/AdminDashboard.css";

const StatCard = ({ icon, label, value, color, to }) => (
    <Link to={to || "#"} className={`stat-card stat-card-${color}`}>
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-body">
            <p className="stat-card-label">{label}</p>
            <h2 className="stat-card-value">{value ?? "—"}</h2>
        </div>
    </Link>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        adminService
            .getStats()
            .then(setStats)
            .catch(() => setError("Failed to load stats."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's what's happening in your store.</p>
                </div>

                {loading && <Loader fullPage />}
                {error && <p className="admin-error">{error}</p>}

                {stats && (
                    <>
                        <div className="stat-grid">
                            <StatCard
                                icon="📦"
                                label="Total Products"
                                value={stats.totalProducts}
                                color="blue"
                                to="/admin/products"
                            />
                            <StatCard
                                icon="👥"
                                label="Total Users"
                                value={stats.totalUsers}
                                color="green"
                            />
                            <StatCard
                                icon="🗂️"
                                label="Categories"
                                value={stats.totalCategories}
                                color="orange"
                                to="/admin/categories"
                            />
                            <StatCard
                                icon="⚠️"
                                label="Low Stock"
                                value={stats.lowStockProducts}
                                color="red"
                                to="/admin/products"
                            />
                        </div>

                        <div className="admin-quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="admin-quick-grid">
                                <Link to="/admin/products/add" className="quick-action-card">
                                    <span>➕</span>
                                    <p>Add Product</p>
                                </Link>
                                <Link to="/admin/products" className="quick-action-card">
                                    <span>📋</span>
                                    <p>Manage Products</p>
                                </Link>
                                <Link to="/admin/categories" className="quick-action-card">
                                    <span>🗂️</span>
                                    <p>Manage Categories</p>
                                </Link>
                                <Link to="/products" className="quick-action-card">
                                    <span>🛒</span>
                                    <p>View Storefront</p>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;