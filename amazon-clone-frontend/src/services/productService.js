import axiosInstance from "../api/axiosInstance";

// All paths match ProductController exactly (@RequestMapping("/api/v1") + /products/**)

// POST /products  (ADMIN) — body: ProductRequest -> ApiResponse<ProductResponse>
const createProduct = async (productRequest) => {
    const { data } = await axiosInstance.post("/products", productRequest);
    return data.data;
};

// GET /products/{id} (public) -> ApiResponse<ProductResponse>
const getProductById = async (id) => {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data.data;
};

// GET /products?page&size&sortBy&sortDir (public) -> ApiResponse<PageResponse<ProductResponse>>
const getAllProducts = async ({
                                  page = 0,
                                  size = 10,
                                  sortBy = "createdAt",
                                  sortDir = "desc",
                              } = {}) => {
    const { data } = await axiosInstance.get("/products", {
        params: { page, size, sortBy, sortDir },
    });
    return data.data;
};

// GET /products/search?name&categoryId&page&size (public) -> ApiResponse<PageResponse<ProductResponse>>
const searchProducts = async ({ name, categoryId, page = 0, size = 10 } = {}) => {
    const { data } = await axiosInstance.get("/products/search", {
        params: {
            name: name || undefined,
            categoryId: categoryId || undefined,
            page,
            size,
        },
    });
    return data.data;
};

// PUT /products/{id} (ADMIN) — body: ProductRequest -> ApiResponse<ProductResponse>
const updateProduct = async (id, productRequest) => {
    const { data } = await axiosInstance.put(`/products/${id}`, productRequest);
    return data.data;
};

// DELETE /products/{id} (ADMIN) -> ApiResponse<Void>
const deleteProduct = async (id) => {
    const { data } = await axiosInstance.delete(`/products/${id}`);
    return data.data;
};

// DELETE /products/{productId}/images/{imageId} (ADMIN) -> ApiResponse<Void>
const deleteProductImage = async (productId, imageId) => {
    const { data } = await axiosInstance.delete(
        `/products/${productId}/images/${imageId}`
    );
    return data.data;
};

const productService = {
    createProduct,
    getProductById,
    getAllProducts,
    searchProducts,
    updateProduct,
    deleteProduct,
    deleteProductImage,
};

export default productService;