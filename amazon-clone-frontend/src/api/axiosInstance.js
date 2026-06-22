import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_KEY = "authUser";

export const tokenStorage = {
    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    getUser: () => {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    },
    setSession: ({ accessToken, refreshToken, ...user }) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clear: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
};

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Attach access token to every outgoing request
axiosInstance.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Refresh-token queueing so concurrent 401s only trigger ONE refresh call ---
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, newAccessToken = null) => {
    pendingQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(newAccessToken);
    });
    pendingQueue = [];
};

// Callback the AuthContext registers so we can force a logout/redirect
// when the refresh token itself is invalid/expired.
let onSessionExpired = () => {};
export const setOnSessionExpired = (callback) => {
    onSessionExpired = callback;
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const isAuthEndpoint = originalRequest?.url?.includes("/auth/login") ||
            originalRequest?.url?.includes("/auth/register") ||
            originalRequest?.url?.includes("/auth/refresh");

        if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            const refreshToken = tokenStorage.getRefreshToken();

            if (!refreshToken) {
                tokenStorage.clear();
                onSessionExpired();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue this request until the in-flight refresh resolves
                return new Promise((resolve, reject) => {
                    pendingQueue.push({ resolve, reject });
                }).then((newAccessToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Matches AuthController POST /auth/refresh -> { refreshToken } -> AuthResponse
                const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken,
                });
                const authResponse = data.data; // unwrap ApiResponse

                tokenStorage.setSession(authResponse);
                processQueue(null, authResponse.accessToken);

                originalRequest.headers.Authorization = `Bearer ${authResponse.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenStorage.clear();
                onSessionExpired();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;