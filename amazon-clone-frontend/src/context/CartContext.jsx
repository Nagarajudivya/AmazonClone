import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import cartService from "../services/cartService";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);       // CartResponse object
    const [loading, setLoading] = useState(false);
    const [cartError, setCartError] = useState(null);

    // Derived: total number of items shown on the badge
    const cartCount = cart?.totalItems ?? 0;

    // ── fetch cart on login ──────────────────────────────────────────────────
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart(null);
            return;
        }
        setLoading(true);
        try {
            const data = await cartService.getCart();
            setCart(data);
        } catch (err) {
            setCartError("Failed to load cart");
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // ── actions ──────────────────────────────────────────────────────────────
    const addToCart = useCallback(async (productId, quantity = 1) => {
        setLoading(true);
        setCartError(null);
        try {
            const updatedCart = await cartService.addToCart({ productId, quantity });
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to add item to cart";
            setCartError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateItem = useCallback(async (cartItemId, quantity) => {
        setLoading(true);
        setCartError(null);
        try {
            const updatedCart = await cartService.updateCartItem(cartItemId, { quantity });
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update cart item";
            setCartError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeItem = useCallback(async (cartItemId) => {
        setLoading(true);
        setCartError(null);
        try {
            const updatedCart = await cartService.removeCartItem(cartItemId);
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to remove cart item";
            setCartError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearCart = useCallback(async () => {
        setLoading(true);
        setCartError(null);
        try {
            const updatedCart = await cartService.clearCart();
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to clear cart";
            setCartError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        cart,
        cartCount,
        loading,
        cartError,
        fetchCart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
};