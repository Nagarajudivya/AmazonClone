import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import productService from "../services/productService";
import Loader from "../components/Loader";
import "../styles/ProductDetails.css";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeImage, setActiveImage] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");
        productService
            .getProductById(id)
            .then((data) => {
                if (cancelled) return;
                setProduct(data);
                const primary = data.images?.find((img) => img.isPrimary) || data.images?.[0];
                setActiveImage(primary?.imageUrl || null);
            })
            .catch((err) => {
                if (!cancelled)
                    setError(err.response?.data?.message || "Product not found.");
            })
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Delete this product permanently? This cannot be undone.")) return;
        setDeleting(true);
        try {
            await productService.deleteProduct(id);
            navigate("/products");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete product.");
            setDeleting(false);
        }
    };

    if (loading) return <Loader fullPage />;
    if (error) return <p className="product-details-error">{error}</p>;
    if (!product) return null;

    return (
        <div className="product-details-page">
            <Link to="/products" className="product-details-back">← Back to products</Link>

            <div className="product-details-grid">
                <div className="product-details-gallery">
                    <div className="product-details-main-image">
                        {activeImage ? (
                            <img src={activeImage} alt={product.name} />
                        ) : (
                            <div className="product-details-no-image">No Image Available</div>
                        )}
                    </div>

                    {product.images?.length > 1 && (
                        <div className="product-details-thumbs">
                            {product.images.map((img) => (
                                <button
                                    key={img.id}
                                    className={`product-details-thumb ${
                                        img.imageUrl === activeImage ? "active" : ""
                                    }`}
                                    onClick={() => setActiveImage(img.imageUrl)}
                                >
                                    <img src={img.imageUrl} alt="" />
                                </button>
                            ))}
                        </div>
                    )}

                    {product.videoUrl && (
                        <video src={product.videoUrl} controls className="product-details-video" />
                    )}
                </div>

                <div className="product-details-info">
                    {product.brand && <span className="product-details-brand">{product.brand}</span>}
                    <h1>{product.name}</h1>

                    {product.rating != null && (
                        <div className="product-details-rating">
                            {"★".repeat(Math.round(product.rating))}
                            {"☆".repeat(5 - Math.round(product.rating))}
                            <span>({product.reviewCount ?? 0} reviews)</span>
                        </div>
                    )}

                    <div className="product-details-price">₹{Number(product.price).toFixed(2)}</div>

                    <div
                        className={`product-details-stock ${
                            product.stockQuantity > 0 ? "in-stock" : "out-stock"
                        }`}
                    >
                        {product.stockQuantity > 0
                            ? `In Stock — ${product.stockQuantity} available`
                            : "Out of Stock"}
                    </div>

                    <p className="product-details-category">
                        Category: <strong>{product.category?.name}</strong>
                    </p>

                    {product.description && (
                        <p className="product-details-description">{product.description}</p>
                    )}

                    {isAdmin && (
                        <div className="product-details-admin-actions">
                            <Link
                                to={`/admin/products/edit/${product.id}`}
                                className="btn btn-secondary"
                            >
                                Edit Product
                            </Link>
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete Product"}
                            </button>
                        </div>
                    )}

                    {/*{isAdmin && (*/}
                    {/*    <div className="product-details-admin-actions">*/}
                    {/*        <Link to={`/products/${product.id}/edit`} className="btn btn-secondary">*/}
                    {/*            Edit Product*/}
                    {/*        </Link>*/}
                    {/*        <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>*/}
                    {/*            {deleting ? "Deleting..." : "Delete Product"}*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;