import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const RegisterPage = () => {
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ fullName: "", email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Mirrors RegisterRequest's @NotBlank / @Email / @Size(min=6) constraints
    const validate = () => {
        const errors = {};
        if (!form.fullName.trim()) errors.fullName = "Full name is required";
        if (!form.email.trim()) errors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Invalid email format";
        if (!form.password) errors.password = "Password is required";
        else if (form.password.length < 6)
            errors.password = "Password must be at least 6 characters";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        if (!validate()) return;

        try {
            await register(form);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            if (err.response?.data?.data && typeof err.response.data.data === "object") {
                setFieldErrors(err.response.data.data);
            } else {
                setServerError(err.response?.data?.message || "Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit} noValidate>
                <h2>Create Account</h2>

                {serverError && <p className="auth-error">{serverError}</p>}

                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        id="fullName"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                    />
                    {fieldErrors.fullName && <span className="form-error">{fieldErrors.fullName}</span>}
                </div>

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
                        autoComplete="new-password"
                    />
                    {fieldErrors.password && <span className="form-error">{fieldErrors.password}</span>}
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>

                <p className="auth-note">
                    New accounts are created with standard (non-admin) access. Product
                    management requires an admin account.
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;