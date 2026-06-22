import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import ProductForm from "../components/ProductForm";
import ImageUploader from "../components/ImageUploader";
import VideoUploader from "../components/VideoUploader";
import productService from "../services/productService";
import "../styles/ProductForm.css";

const AdminCreateProduct = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [createdProduct, setCreatedProduct] = useState(null);

    const handleCreate = async (productRequest) => {
        setSubmitting(true);
        setError("");
        try {
            const product = await productService.createProduct(productRequest);
            setCreatedProduct(product);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create product.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <div>
                        <h1>Add Product</h1>
                        <p>Fill in the details below to create a new product.</p>
                    </div>
                </div>

                {error && <p className="admin-error" style={{ marginBottom: "1rem" }}>{error}</p>}

                {!createdProduct ? (
                    <ProductForm
                        onSubmit={handleCreate}
                        submitting={submitting}
                        submitLabel="Create Product"
                    />
                ) : (
                    <div>
                        <p style={{ color: "green", marginBottom: "1rem" }}>
                            ✅ &quot;{createdProduct.name}&quot; created! Optionally add images and a video below.
                        </p>

                        <ImageUploader
                            productId={createdProduct.id}
                            existingImages={createdProduct.images}
                            onUpdated={setCreatedProduct}
                        />

                        <VideoUploader
                            productId={createdProduct.id}
                            existingVideoUrl={createdProduct.videoUrl}
                            onUpdated={setCreatedProduct}
                        />

                        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                            <button
                                className="admin-btn admin-btn-primary"
                                onClick={() => navigate("/admin/products")}
                            >
                                ← Back to Products
                            </button>
                            <button
                                className="admin-btn admin-btn-secondary"
                                onClick={() => navigate(`/products/${createdProduct.id}`)}
                            >
                                View on Storefront
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminCreateProduct;