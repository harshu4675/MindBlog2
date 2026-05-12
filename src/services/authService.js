import { api } from "./api";

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),

  register: (userData) => api.post("/auth/register", userData),

  logout: () => {
    localStorage.removeItem("mindblog-token");
    return Promise.resolve();
  },

  getMe: () => api.get("/auth/me", true),

  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }),

  updatePassword: (data) => api.put("/auth/update-password", data, true),

  googleAuth: (tokenId) => api.post("/auth/google", { tokenId }),

  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
};
