import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import ImageUploader from "../components/ImageUploader";
import VideoUploader from "../components/VideoUploader";
import Loader from "../components/Loader";
import productService from "../services/productService";
import "../styles/ProductForm.css";

const EditProductPage = () => {
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
            .catch((err) => !cancelled && setLoadError(err.response?.data?.message || "Product not found."))
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
            navigate(`/products/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update product.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader fullPage />;
    if (loadError) return <p className="product-details-error">{loadError}</p>;
    if (!product) return null;

    return (
        <div className="edit-product-page">
            <h1>Edit Product</h1>

            {error && <p className="form-error" style={{ marginBottom: "1rem" }}>{error}</p>}

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
    );
};

export default EditProductPage;