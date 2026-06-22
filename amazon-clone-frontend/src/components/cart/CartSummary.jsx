import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import "../../styles/CartSummary.css";

const CartSummary = () => {
    const { cart, clearCart, loading } = useCart();
    const [clearing, setClearing] = useState(false);
    const [clearError, setClearError] = useState("");

    if (!cart) return null;

    const handleClearCart = async () => {
        if (!window.confirm("Remove all items from your cart?")) return;
        setClearing(true);
        setClearError("");
        try {
            await clearCart();
        } catch {
            setClearError("Failed to clear cart. Please try again.");
        } finally {
            setClearing(false);
        }
    };

    return (
        <aside className="cart-summary">
            <h2 className="cart-summary-title">Order Summary</h2>

            <div className="cart-summary-row">
                <span>Items ({cart.totalItems})</span>
                <span>₹{Number(cart.totalAmount).toFixed(2)}</span>
            </div>

            <div className="cart-summary-row cart-summary-row--shipping">
                <span>Shipping</span>
                <span className="cart-summary-free">FREE</span>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-row cart-summary-row--total">
                <span>Order Total</span>
                <span>₹{Number(cart.totalAmount).toFixed(2)}</span>
            </div>

            {clearError && <p className="cart-summary-error">{clearError}</p>}

            <button
                className="cart-summary-checkout-btn"
                disabled={cart.totalItems === 0 || loading}
            >
                Proceed to Checkout
            </button>

            {cart.totalItems > 0 && (
                <button
                    className="cart-summary-clear-btn"
                    onClick={handleClearCart}
                    disabled={clearing || loading}
                >
                    {clearing ? "Clearing…" : "Empty Cart"}
                </button>
            )}
        </aside>
    );
};

export default CartSummary;