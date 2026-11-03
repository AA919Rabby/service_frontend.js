import { STORAGE_KEYS } from "./constants";

/**
 * Production-Level Token & Auth Storage Service
 * Centralizes all access to Authentication Tokens and User Profiles.
 */
class TokenService {
    // --- Token Methods ---
    saveToken(token) {
        if (!token) return;
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }

    getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN) || null;
    }

    removeToken() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }

    // --- User Profile Methods ---
    saveUser(user) {
        if (!user) return;
        try {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        } catch (error) {
            console.error("Failed to serialize user profile:", error);
        }
    }

    getUser() {
        const data = localStorage.getItem(STORAGE_KEYS.USER);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

    removeUser() {
        localStorage.removeItem(STORAGE_KEYS.USER);
    }

    // --- Universal Session Saver (Handles any backend structure) ---
    saveAuth(response) {
        const token =
            response?.token ||
            response?.accessToken ||
            response?.data?.token ||
            response?.data?.accessToken;

        const user = response?.user || response?.data?.user;

        if (token) this.saveToken(token);
        if (user) this.saveUser(user);

        return Boolean(token);
    }

    // --- Global Sign Out / Wipe ---
    clearAuth() {
        this.removeToken();
        this.removeUser();
    }

    // --- Quick Status Check ---
    isAuthenticated() {
        return Boolean(this.getToken());
    }
}

// Export a single instance to be used everywhere
export const tokenService = new TokenService();
export default tokenService;