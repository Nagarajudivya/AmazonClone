import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { setOnSessionExpired, tokenStorage } from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => tokenStorage.getUser());
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const navigate = useNavigate();

    // When the axios interceptor can't refresh the token, force logout + redirect
    useEffect(() => {
        setOnSessionExpired(() => {
            setUser(null);
            navigate("/login");
        });
    }, [navigate]);

    const login = useCallback(async (credentials) => {
        setLoading(true);
        setAuthError(null);
        try {
            const authResponse = await authService.login(credentials);
            setUser(tokenStorage.getUser());
            return authResponse;
        } catch (err) {
            const message = err.response?.data?.message || "Login failed. Please try again.";
            setAuthError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (payload) => {
        setLoading(true);
        setAuthError(null);
        try {
            const authResponse = await authService.register(payload);
            setUser(tokenStorage.getUser());
            return authResponse;
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed. Please try again.";
            setAuthError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (_) {
            // ignore network errors during logout, local session is cleared regardless
        } finally {
            setUser(null);
            navigate("/login");
        }
    }, [navigate]);

    const value = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ROLE_ADMIN",
        loading,
        authError,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};