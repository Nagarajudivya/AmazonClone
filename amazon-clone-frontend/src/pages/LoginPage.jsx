import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const LoginPage = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const errors = {};
        if (!form.email.trim()) errors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Invalid email format";
        if (!form.password) errors.password = "Password is required";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        if (!validate()) return;

        try {
            const authResponse = await login(form);

            // Role-based redirect after login
            if (authResponse.role === "ROLE_ADMIN") {
                navigate("/admin", { replace: true });
            } else {
                // Honor the original destination if the user was redirected to login
                const from = location.state?.from?.pathname || "/products";
                navigate(from, { replace: true });
            }
        } catch (err) {
            if (err.response?.data?.data && typeof err.response.data.data === "object") {
                setFieldErrors(err.response.data.data);
            } else {
                setServerError(err.response?.data?.message || "Login failed. Please try again.");
            }
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit} noValidate>
                <h2>Sign In</h2>

                {serverError && <p className="auth-error">{serverError}</p>}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                    {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                    {fieldErrors.password && <span className="form-error">{fieldErrors.password}</span>}
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="auth-switch">
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;