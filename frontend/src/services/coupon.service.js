import api from "../lib/api";

export const couponService = {
  // Admin Only
  getAll: async () => {
    const response = await api.get("/coupons/all");
    return response.data;
  },
  add: async (couponData) => {
    const response = await api.post("/coupons/add", couponData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  }
};