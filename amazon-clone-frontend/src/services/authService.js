import axiosInstance, { tokenStorage } from "../api/axiosInstance";

// Matches AuthController.register -> POST /auth/register
// Body: { fullName, email, password } -> ApiResponse<AuthResponse>
const register = async ({ fullName, email, password }) => {
    const { data } = await axiosInstance.post("/auth/register", {
        fullName,
        email,
        password,
    });
    const authResponse = data.data;
    tokenStorage.setSession(authResponse);
    return authResponse;
};

// Matches AuthController.login -> POST /auth/login
// Body: { email, password } -> ApiResponse<AuthResponse>
const login = async ({ email, password }) => {
    const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
    });
    const authResponse = data.data;
    tokenStorage.setSession(authResponse);
    return authResponse;
};

// Matches AuthController.logout -> POST /auth/logout (requires Bearer access token)
const logout = async () => {
    try {
        await axiosInstance.post("/auth/logout");
    } finally {
        tokenStorage.clear();
    }
};

// Matches AuthController.refresh -> POST /auth/refresh
// Body: { refreshToken } -> ApiResponse<AuthResponse>
const refreshToken = async () => {
    const refreshTokenValue = tokenStorage.getRefreshToken();
    const { data } = await axiosInstance.post("/auth/refresh", {
        refreshToken: refreshTokenValue,
    });
    const authResponse = data.data;
    tokenStorage.setSession(authResponse);
    return authResponse;
};

const getCurrentUser = () => tokenStorage.getUser();
const isAuthenticated = () => !!tokenStorage.getAccessToken();
const isAdmin = () => tokenStorage.getUser()?.role === "ROLE_ADMIN";

const authService = {
    register,
    login,
    logout,
    refreshToken,
    getCurrentUser,
    isAuthenticated,
    isAdmin,
};

export default authService;