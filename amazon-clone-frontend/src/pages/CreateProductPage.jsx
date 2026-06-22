import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import ImageUploader from "../components/ImageUploader";
import VideoUploader from "../components/VideoUploader";
import productService from "../services/productService";
import "../styles/ProductForm.css";

const CreateProductPage = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    // Once the product is created we keep it in state so the image/video
    // uploaders (which need a productId) can appear without leaving the page.
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
        <div className="create-product-page">
            <h1>Create New Product</h1>

            {error && <p className="form-error" style={{ marginBottom: "1rem" }}>{error}</p>}

            {!createdProduct ? (
                <ProductForm onSubmit={handleCreate} submitting={submitting} submitLabel="Create Product" />
            ) : (
                <div>
                    <p className="create-product-success">
                        "{createdProduct.name}" was created. Optionally add images and a video below,
                        then go to the product page.
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

                    <button
                        className="product-form-submit"
                        onClick={() => navigate(`/products/${createdProduct.id}`)}
                    >
                        View Product
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateProductPage;