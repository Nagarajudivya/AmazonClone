import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import "../../styles/CartItem.css";

const PLACEHOLDER_IMG =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='100%25' height='100%25' fill='%23f0f0f0'/><text x='50%25' y='50%25' fill='%23999' font-size='16' text-anchor='middle' dy='.3em'>No Image</text></svg>";

const CartItem = ({ item }) => {
    const { updateItem, removeItem } = useCart();
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    const handleQuantityChange = async (newQty) => {
        if (newQty < 1) return;
        if (newQty > item.stockQuantity) {
            setError(`Only ${item.stockQuantity} in stock`);
            return;
        }
        setError("");
        setUpdating(true);
        try {
            await updateItem(item.id, newQty);
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        } finally {
            setUpdating(false);
        }
    };

    const handleRemove = async () => {
        setUpdating(true);
        try {
            await removeItem(item.id);
        } catch {
            setUpdating(false);
        }
    };

    return (
        <div className={`cart-item ${updating ? "cart-item--updating" : ""}`}>
            <img
                className="cart-item-image"
                src={item.productImageUrl || PLACEHOLDER_IMG}
                alt={item.productName}
                loading="lazy"
            />

            <div className="cart-item-details">
                {item.productBrand && (
                    <span className="cart-item-brand">{item.productBrand}</span>
                )}
                <p className="cart-item-name">{item.productName}</p>
                <p className="cart-item-price">₹{Number(item.price).toFixed(2)} each</p>
                {error && <p className="cart-item-error">{error}</p>}
            </div>

            <div className="cart-item-controls">
                <div className="cart-item-qty">
                    <button
                        className="cart-item-qty-btn"
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={updating || item.quantity <= 1}
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>
                    <span className="cart-item-qty-value">{item.quantity}</span>
                    <button
                        className="cart-item-qty-btn"
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        disabled={updating || item.quantity >= item.stockQuantity}
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                <p className="cart-item-subtotal">₹{Number(item.subtotal).toFixed(2)}</p>

                <button
                    className="cart-item-remove"
                    onClick={handleRemove}
                    disabled={updating}
                    aria-label="Remove item"
                >
                    🗑 Remove
                </button>
            </div>
        </div>
    );
};

export default CartItem;