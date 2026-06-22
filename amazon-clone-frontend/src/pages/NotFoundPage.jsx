import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <h1>404</h1>
        <p>Page not found.</p>
        <Link to="/products" style={{ color: "var(--color-link)" }}>
            Back to products
        </Link>
    </div>
);

export default NotFoundPage;