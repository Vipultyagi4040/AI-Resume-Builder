import axios from "axios";

const isProduction = import.meta.env.PROD;
const baseURL = isProduction
  ? (import.meta.env.VITE_API_URL || "https://your-api-url.onrender.com")
  : "http://localhost:9090";

const authApi = axios.create({
  baseURL,
});

const normalizeError = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

export const authSignup = async ({ name, email, password }) => {
  try {
    const response = await authApi.post("/api/v1/auth/signup", { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(normalizeError(error, "Signup failed"));
  }
};

export const authLogin = async ({ email, password }) => {
  try {
    const response = await authApi.post("/api/v1/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(normalizeError(error, "Login failed"));
  }
};

export const authForgotPassword = async ({ email }) => {
  try {
    const response = await authApi.post("/api/v1/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw new Error(normalizeError(error, "Failed to send reset code"));
  }
};

export const authResetPassword = async ({ email, code, newPassword }) => {
  try {
    const response = await authApi.post("/api/v1/auth/reset-password", {
      email,
      code,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeError(error, "Failed to reset password"));
  }
};

export const authGoogle = async ({ idToken }) => {
  try {
    const response = await authApi.post("/api/v1/auth/google", { idToken });
    return response.data;
  } catch (error) {
    throw new Error(normalizeError(error, "Google login failed"));
  }
};
