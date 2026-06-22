import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import Loader from "../../components/Loader";
import "../../styles/Cart.css";

const Cart = () => {
    const { cart, loading, cartError } = useCart();

    if (loading && !cart) {
        return (
            <div className="cart-loader">
                <Loader />
            </div>
        );
    }

    if (cartError) {
        return (
            <div className="cart-error-wrap">
                <p className="cart-error">{cartError}</p>
            </div>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div className="cart-page">
            <h1 className="cart-heading">Your Cart</h1>

            {isEmpty ? (
                <div className="cart-empty">
                    <p className="cart-empty-icon">🛒</p>
                    <p className="cart-empty-text">Your cart is empty.</p>
                    <Link to="/products" className="cart-empty-link">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <section className="cart-items-section">
                        {cart.items.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </section>

                    <CartSummary />
                </div>
            )}
        </div>
    );
};

export default Cart;