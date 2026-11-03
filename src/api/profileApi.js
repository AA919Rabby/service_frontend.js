import apiClient from "./apiClient";

export const getProfileApi = async () => apiClient.get("/profile/profile");

export const updateProfileApi = async (formData) => {
    return await apiClient.patch("/profile/profileUpdate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const deleteAccountApi = async () => apiClient.delete("/profile/deleteAccount");