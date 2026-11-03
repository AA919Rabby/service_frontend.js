// Automatically loaded from your .env file
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Log to console during development so you can verify it loaded
if (import.meta.env.DEV) {
    console.log('Current API Base URL loaded from .env:', API_BASE_URL);
}

export const STORAGE_KEYS = {
    TOKEN: 'service_web_token',
    USER: 'service_web_user',
};