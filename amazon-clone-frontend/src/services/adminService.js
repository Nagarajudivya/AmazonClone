import axiosInstance from "../api/axiosInstance";

// GET /api/v1/admin/stats -> ApiResponse<StatsResponse>
const getStats = async () => {
    const { data } = await axiosInstance.get("/admin/stats");
    return data.data;
};

const adminService = { getStats };
export default adminService;