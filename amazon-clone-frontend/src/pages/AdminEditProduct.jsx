import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import ProductForm from "../components/ProductForm";
import ImageUploader from "../components/ImageUploader";
import VideoUploader from "../components/VideoUploader";
import Loader from "../components/Loader";
import productService from "../services/productService";
import "../styles/ProductForm.css";

const AdminEditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        let cancelled = false;
        productService
            .getProductById(id)
            .then((data) => !cancelled && setProduct(data))
            .catch((err) =>
                !cancelled &&
                setLoadError(err.response?.data?.message || "Product not found.")
            )
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleUpdate = async (productRequest) => {
        setSubmitting(true);
        setError("");
        try {
            const updated = await productService.updateProduct(id, productRequest);
            setProduct(updated);
            navigate("/admin/products");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update product.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <AdminLayout><Loader fullPage /></AdminLayout>;
    if (loadError) return <AdminLayout><p className="admin-error">{loadError}</p></AdminLayout>;
    if (!product) return null;

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <div>
                        <h1>Edit Product</h1>
                        <p>Update the details for &quot;{product.name}&quot;</p>
                    </div>
                    <button
                        className="admin-btn admin-btn-secondary"
                        onClick={() => navigate("/admin/products")}
                    >
                        ← Back to Products
                    </button>
                </div>

                {error && <p className="admin-error" style={{ marginBottom: "1rem" }}>{error}</p>}

                <ProductForm
                    initialValues={product}
                    onSubmit={handleUpdate}
                    submitting={submitting}
                    submitLabel="Save Changes"
                />

                <div style={{ marginTop: "1.5rem", maxWidth: "640px" }}>
                    <ImageUploader
                        productId={product.id}
                        existingImages={product.images}
                        onUpdated={setProduct}
                    />
                    <VideoUploader
                        productId={product.id}
                        existingVideoUrl={product.videoUrl}
                        onUpdated={setProduct}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminEditProduct;