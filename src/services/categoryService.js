import { api } from "./api";

export const categoryService = {
  getAll: () => api.get("/categories"),

  getById: (id) => api.get(`/categories/${id}`),

  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),

  create: (data) => api.post("/categories", data, true),

  update: (id, data) => api.put(`/categories/${id}`, data, true),

  delete: (id) => api.delete(`/categories/${id}`, true),

  getTrending: () => api.get("/categories/trending"),
};
