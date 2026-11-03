import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import tokenService from "../utils/tokenService";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 75000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically inject Bearer Token from tokenService
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: If 401 Unauthorized, automatically wipe token
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            tokenService.clearAuth();
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        console.error("RAW BACKEND ERROR:", error.response?.data || error);
        return Promise.reject(error);
    }
);

export default apiClient;