import React, { useState } from "react";
import uploadService from "../services/uploadService";
import productService from "../services/productService";
import "../styles/Uploader.css";

// Calls POST /products/{id}/images (field name "images", multiple files)
const ImageUploader = ({ productId, existingImages = [], onUpdated }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        setPreviews(files.map((file) => URL.createObjectURL(file)));
        setError("");
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;
        setUploading(true);
        setError("");
        try {
            const updatedProduct = await uploadService.uploadProductImages(productId, selectedFiles);
            onUpdated(updatedProduct);
            setSelectedFiles([]);
            setPreviews([]);
        } catch (err) {
            setError(err.response?.data?.message || "Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteExisting = async (imageId) => {
        setDeletingId(imageId);
        try {
            await productService.deleteProductImage(productId, imageId);
            const refreshed = await productService.getProductById(productId);
            onUpdated(refreshed);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete image.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="uploader">
            <h4>Product Images</h4>

            {existingImages.length > 0 && (
                <div className="uploader-existing-grid">
                    {existingImages.map((img) => (
                        <div className="uploader-thumb" key={img.id}>
                            <img src={img.imageUrl} alt="Product" />
                            {img.isPrimary && <span className="uploader-primary-badge">Primary</span>}
                            <button
                                type="button"
                                className="uploader-remove-btn"
                                disabled={deletingId === img.id}
                                onClick={() => handleDeleteExisting(img.id)}
                            >
                                {deletingId === img.id ? "..." : "✕"}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />

            {previews.length > 0 && (
                <div className="uploader-preview-grid">
                    {previews.map((src, idx) => (
                        <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="uploader-thumb-img" />
                    ))}
                </div>
            )}

            {error && <p className="uploader-error">{error}</p>}

            <button
                type="button"
                className="uploader-upload-btn"
                disabled={selectedFiles.length === 0 || uploading}
                onClick={handleUpload}
            >
                {uploading ? "Uploading..." : `Upload ${selectedFiles.length || ""} Image(s)`}
            </button>
        </div>
    );
};

export default ImageUploader;