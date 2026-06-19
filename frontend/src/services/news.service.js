import api from "../lib/api";

export const newsService = {
  // Public
  getAll: async () => {
    const response = await api.get("/news/");
    return response.data;
  },
  
  // Admin
  add: async (newsData) => {
    const response = await api.post("/news/add", newsData);
    return response.data;
  },
  update: async (id, newsData) => {
    const response = await api.put(`/news/${id}`, newsData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  }
};