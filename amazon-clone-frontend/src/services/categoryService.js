import axiosInstance from "../api/axiosInstance";

// POST /categories (ADMIN) — body: { name, description } -> ApiResponse<CategoryResponse>
const createCategory = async ({ name, description }) => {
    const { data } = await axiosInstance.post("/categories", { name, description });
    return data.data;
};

// GET /categories (public) -> ApiResponse<CategoryResponse[]>
const getAllCategories = async () => {
    const { data } = await axiosInstance.get("/categories");
    return data.data;
};

// GET /categories/{id} (public) -> ApiResponse<CategoryResponse>
const getCategoryById = async (id) => {
    const { data } = await axiosInstance.get(`/categories/${id}`);
    return data.data;
};

// PUT /categories/{id} (ADMIN) — body: { name, description } -> ApiResponse<CategoryResponse>
const updateCategory = async (id, { name, description }) => {
    const { data } = await axiosInstance.put(`/categories/${id}`, { name, description });
    return data.data;
};

// DELETE /categories/{id} (ADMIN) -> ApiResponse<Void>
const deleteCategory = async (id) => {
    const { data } = await axiosInstance.delete(`/categories/${id}`);
    return data.data;
};

const categoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};

export default categoryService;