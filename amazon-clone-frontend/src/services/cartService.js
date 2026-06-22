import axiosInstance from "../api/axiosInstance";


const cartService = {
    getCart: async () => {
        const { data } = await axiosInstance.get("/cart");
        return data.data; // CartResponse
    },

    addToCart: async ({ productId, quantity }) => {
        const { data } = await axiosInstance.post("/cart/add", { productId, quantity });
        return data.data;
    },

    updateCartItem: async (cartItemId, { quantity }) => {
        const { data } = await axiosInstance.put(`/cart/items/${cartItemId}`, { quantity });
        return data.data;
    },

    removeCartItem: async (cartItemId) => {
        const { data } = await axiosInstance.delete(`/cart/items/${cartItemId}`);
        return data.data;
    },

    clearCart: async () => {
        const { data } = await axiosInstance.delete("/cart/clear");
        return data.data;
    },
};

export default cartService;