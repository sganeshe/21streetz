import api from "../lib/api";

const formHeaders = {
  headers: { "Content-Type": "multipart/form-data" }
};

export const pressService = {
  // Public
  getAll: async () => {
    const response = await api.get("/press/");
    return response.data;
  },
  
  // Admin
  add: async (pressFormData) => {
    const response = await api.post("/press/add", pressFormData, formHeaders);
    return response.data;
  },
  update: async (id, pressFormData) => {
    const response = await api.put(`/press/${id}`, pressFormData, formHeaders);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/press/${id}`);
    return response.data;
  }
};