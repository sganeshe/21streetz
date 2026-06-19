import api from "../lib/api";

const formHeaders = {
  headers: { "Content-Type": "multipart/form-data" }
};

export const productService = {
  // Public
  getAll: async () => {
    const response = await api.get("/products/all");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  // Admin
  add: async (productFormData) => {
    const response = await api.post("/products/add", productFormData, formHeaders);
    return response.data;
  },
  update: async (id, productFormData) => {
    const response = await api.put(`/products/${id}`, productFormData, formHeaders);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};