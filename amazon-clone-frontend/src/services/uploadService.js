import axiosInstance from "../api/axiosInstance";

// POST /products/{id}/images (ADMIN, multipart/form-data)
// Backend field name is exactly "images" (List<MultipartFile>) -> ApiResponse<ProductResponse>
const uploadProductImages = async (productId, fileList) => {
    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("images", file));

    const { data } = await axiosInstance.post(
        `/products/${productId}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
};

// POST /products/{id}/video (ADMIN, multipart/form-data)
// Backend field name is exactly "video" (single MultipartFile) -> ApiResponse<ProductResponse>
const uploadProductVideo = async (productId, file) => {
    const formData = new FormData();
    formData.append("video", file);

    const { data } = await axiosInstance.post(
        `/products/${productId}/video`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
};

const uploadService = {
    uploadProductImages,
    uploadProductVideo,
};

export default uploadService;