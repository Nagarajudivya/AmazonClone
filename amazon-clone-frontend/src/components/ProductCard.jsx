import React from "react";
import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

const PLACEHOLDER_IMG =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='100%25' height='100%25' fill='%23f0f0f0'/><text x='50%25' y='50%25' fill='%23999' font-size='16' text-anchor='middle' dy='.3em'>No Image</text></svg>";

const ProductCard = ({ product }) => {
    const primaryImage =
        product.images?.find((img) => img.isPrimary)?.imageUrl ||
        product.images?.[0]?.imageUrl ||
        PLACEHOLDER_IMG;

    return (
        <Link to={`/products/${product.id}`} className="product-card">
            <div className="product-card-image-wrap">
                <img src={primaryImage} alt={product.name} loading="lazy" />
            </div>
            <div className="product-card-body">
                {product.brand && <span className="product-card-brand">{product.brand}</span>}
                <h3 className="product-card-name">{product.name}</h3>

                {product.rating != null && (
                    <div className="product-card-rating">
                        {"★".repeat(Math.round(product.rating))}
                        {"☆".repeat(5 - Math.round(product.rating))}
                        <span className="product-card-review-count">
              ({product.reviewCount ?? 0})
            </span>
                    </div>
                )}

                <div className="product-card-price">₹{Number(product.price).toFixed(2)}</div>

                <div className={`product-card-stock ${product.stockQuantity > 0 ? "in-stock" : "out-stock"}`}>
                    {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : "Out of Stock"}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;