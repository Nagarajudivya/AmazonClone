import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const { cartCount } = useCart();
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(query.trim() ? `/products?name=${encodeURIComponent(query.trim())}` : "/products");
    };

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    amazon<span className="navbar-logo-accent">clone</span>
                </Link>

                <form className="navbar-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search products"
                    />
                    <button type="submit" aria-label="Search">🔍</button>
                </form>

                <nav className="navbar-links">
                    {/* ROLE_USER links */}
                    {!isAdmin && (
                        <>
                            <Link to="/products">Products</Link>
                            {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
                        </>
                    )}

                    {isAuthenticated && !isAdmin && (
                        <Link to="/cart" className="navbar-cart" aria-label="Cart">
                            🛒
                            {cartCount > 0 && (
                                <span className="navbar-cart-badge">{cartCount}</span>
                            )}
                        </Link>
                    )}


                    {/* ROLE_ADMIN shortcut — admin lives in sidebar, but give a quick link */}
                    {isAdmin && (
                        <Link to="/admin" className="navbar-admin-link">
                            🛠 Admin Panel
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <div className="navbar-user">
                            <span className="navbar-username">Hi, {user?.fullName?.split(" ")[0]}</span>
                            {isAdmin && (
                                <span className="navbar-role-badge">ADMIN</span>
                            )}
                            <button className="navbar-logout" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="navbar-cta">Sign Up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;