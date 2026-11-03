import apiClient from "./apiClient";
export { getErrorMessage } from "./authApi";

export const getImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const apiBase = apiClient.defaults?.baseURL || "https://service-js.onrender.com/api/v1";
    const host = apiBase.replace(/\/api\/v1|\/v1\/api|\/api|\/v1/g, "").replace(/\/+$/, "");
    const cleanPath = String(path).replace(/\\/g, "/").replace(/^\/+/, "");
    return `${host}/${cleanPath}`;
};

// Services & Categories
export const getCategoriesApi = async () => apiClient.get("/categories");

export const getServicesApi = async ({ page = 1, limit = 6, search = "", category = "" }) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (category && category !== "all") params.append("category", category);
    return await apiClient.get(`/services/?${params.toString()}`);
};

export const getServiceDetailsApi = async (id) => apiClient.get(`/services/details/${id}`);

// Reviews
export const addServiceReviewApi = async (serviceId, { rating, comment }) => {
    return await apiClient.post(`/services/${serviceId}/reviews`, { rating, comment });
};

// 🌟 ORDERS APIS (Exact Swagger: POST /api/v1/orders/create-order)
export const createOrderApi = async (orderData) => {
    try {
        return await apiClient.post("/orders/create-order", orderData);
    } catch (err) {
        if (err.response?.status === 404) {
            return await apiClient.post("/orders", orderData);
        }
        throw err;
    }
};

export const getMyOrdersApi = async () => apiClient.get("/orders/my-orders");
export const cancelOrderApi = async (orderId) => apiClient.patch(`/orders/${orderId}/cancel`);

// Notifications
export const getMyNotificationsApi = async () => apiClient.get("/profile/myNotifications");

// 🌟 PAYMENT SESSION APIS (With multi-route resilience for Render backend)
export const createStripeSessionApi = async (orderId) => {
    // Try the 3 common Stripe route paths your backend might use
    try {
        return await apiClient.post("/payments/stripe/create-checkout-session", { orderId });
    } catch (err1) {
        if (err1.response?.status === 404) {
            try {
                return await apiClient.post("/payments/stripe/create-session", { orderId });
            } catch (err2) {
                if (err2.response?.status === 404) {
                    return await apiClient.post(`/payments/stripe/${orderId}`);
                }
                throw err2;
            }
        }
        throw err1;
    }
};

export const createSSLCommerzSessionApi = async (orderId) => {
    try {
        return await apiClient.post("/payments/sslcommerz/create-session", { orderId });
    } catch (err1) {
        if (err1.response?.status === 404) {
            return await apiClient.post("/payments/sslcommerz/init", { orderId });
        }
        throw err1;
    }
};


export const chatWithAiApi = async ({ prompt, imageFile }) => {
    const formData = new FormData();
    if (prompt) formData.append("prompt", prompt);
    if (imageFile) formData.append("image", imageFile);

    return await apiClient.post("/ai/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};