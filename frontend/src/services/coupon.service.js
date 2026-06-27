import api from "../lib/api";

export const couponService = {
  // Admin Only
  getAll: async () => {
    const response = await api.get("/coupons/all");
    return response.data;
  },
  validate: async (code) => {
    const response = await api.post("/coupons/validate", { code });
    return response.data;
  }
};