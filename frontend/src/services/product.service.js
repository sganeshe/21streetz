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
  
};