import apiClient from "./apiClient";

// Deep extractor for any backend error structure (Express, Nest, Django, etc.)
export const getErrorMessage = (error) => {
    const data = error.response?.data;

    if (!data) {
        return error.message || "Unable to connect to server. Please try again.";
    }

    // 1. If backend sent an array of detailed field errors: errors: [{ msg: "..." }] or [{ message: "..." }]
    if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors
            .map((err) => err.msg || err.message || (typeof err === "string" ? err : JSON.stringify(err)))
            .join(" • ");
    }

    // 2. If backend sent an object: errors: { password: "Must be 8 characters", email: "Invalid" }
    if (data.errors && typeof data.errors === "object") {
        return Object.values(data.errors).flat().join(" • ");
    }

    // 3. If backend sent nested 'details': details: [{ message: "..." }]
    if (Array.isArray(data.details)) {
        return data.details.map((d) => d.message || d.msg).join(" • ");
    }

    // 4. If backend sent a descriptive message or error string
    if (data.message && data.message !== "Validation error") return data.message;
    if (data.error) return data.error;

    // 5. Fallback to raw data string or message
    if (typeof data === "string") return data;
    return data.message || "Validation failed. Please check your inputs.";
};

// 1. POST /api/v1/auth/register
export const registerApi = async ({ name, email, password, turnstileToken }) => {
    return await apiClient.post(
        "/auth/register",
        {
            turnstileToken,
            name,
            email,
            password,
        },
        {
            headers: {
                "cf-turnstile-response": turnstileToken,
            },
        }
    );
};

// 2. POST /api/v1/auth/verify_registration_otp
export const verifyRegistrationOtpApi = async ({ email, otp }) => {
    return await apiClient.post("/auth/verify-registration-otp", {
        email,
        otp,
    });
};

// 3. POST /api/v1/auth/login
export const loginApi = async ({ email, password, turnstileToken }) => {
    return await apiClient.post(
        "/auth/login",
        {
            email,
            password,
            turnstileToken,
        },
        {
            headers: {
                "cf-turnstile-response": turnstileToken || "",
            },
        }
    );
};

// 4. POST /api/v1/auth/forgot-password
export const forgotPasswordApi = async ({ email }) => {
    return await apiClient.post("/auth/forgot-password", {
        email,
    });
};

// 5. POST /api/v1/auth/verify-reset-otp
export const verifyResetOtpApi = async ({ otp }) => {
    return await apiClient.post("/auth/verify-reset-otp", {
        otp,
    });
};

// 6. POST /api/v1/auth/reset-password
export const resetPasswordApi = async ({ forgotToken, newPassword }) => {
    return await apiClient.post("/auth/reset-password", {
        forgotToken,
        newPassword,
    });
};

// 7. POST /api/v1/auth/googleSignIn
// 7. POST /api/v1/auth/googleSignIn
export const googleSignInApi = async ({ idToken, turnstileToken, mode }) => {
    return await apiClient.post(
        "/auth/googleSignIn",
        {
            idToken,
            turnstileToken,
            mode, // ⚡ FIXED: Sends "login" or "register" to the backend!
        },
        {
            headers: {
                "cf-turnstile-response": turnstileToken || "",
            },
        }
    );
};