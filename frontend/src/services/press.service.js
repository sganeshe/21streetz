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
  
};