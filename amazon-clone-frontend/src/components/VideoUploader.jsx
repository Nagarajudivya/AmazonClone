import React, { useState } from "react";
import uploadService from "../services/uploadService";
import "../styles/Uploader.css";

// Calls POST /products/{id}/video (field name "video", single file)
const VideoUploader = ({ productId, existingVideoUrl, onUpdated }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setError("");
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            const updatedProduct = await uploadService.uploadProductVideo(productId, file);
            onUpdated(updatedProduct);
            setFile(null);
            setPreview(null);
        } catch (err) {
            setError(err.response?.data?.message || "Video upload failed.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="uploader">
            <h4>Product Video</h4>

            {existingVideoUrl && !preview && (
                <video src={existingVideoUrl} controls className="uploader-video" />
            )}

            <input type="file" accept="video/*" onChange={handleFileChange} />

            {preview && <video src={preview} controls className="uploader-video" />}

            {error && <p className="uploader-error">{error}</p>}

            <button
                type="button"
                className="uploader-upload-btn"
                disabled={!file || uploading}
                onClick={handleUpload}
            >
                {uploading ? "Uploading..." : "Upload Video"}
            </button>
        </div>
    );
};

export default VideoUploader;