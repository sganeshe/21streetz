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

};