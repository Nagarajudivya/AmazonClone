import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

const DashboardPage = () => {
    const { user, isAdmin } = useAuth();

    return (
        <div className="dashboard-page">
            <h1>Welcome back, {user?.fullName}</h1>
            <p className="dashboard-subtitle">
                Signed in as <strong>{user?.email}</strong> · Role:{" "}
                <span className={`dashboard-role-badge ${isAdmin ? "admin" : "user"}`}>
          {user?.role?.replace("ROLE_", "")}
        </span>
            </p>

            <div className="dashboard-grid">
                <Link to="/products" className="dashboard-tile">
                    <h3>Browse Products</h3>
                    <p>View, search and filter all products in the catalog.</p>
                </Link>

                {isAdmin && (
                    <Link to="/admin" className="dashboard-tile dashboard-tile-admin">
                        <h3>Admin Panel</h3>
                        <p>Manage products, categories and view store statistics.</p>
                    </Link>
                )}

                {/*{isAdmin && (*/}
                {/*    <Link to="/products/create" className="dashboard-tile dashboard-tile-admin">*/}
                {/*        <h3>Create Product</h3>*/}
                {/*        <p>Add a new product, with images and video.</p>*/}
                {/*    </Link>*/}
                {/*)}*/}
            </div>

            {!isAdmin && (
                <p className="dashboard-note">
                    Your account has standard user access. Creating, editing, or
                    deleting products requires an admin account, which can only be
                    granted directly in the database for this project.
                </p>
            )}
        </div>
    );
};

export default DashboardPage;