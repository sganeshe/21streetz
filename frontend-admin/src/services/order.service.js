import api from "../lib/api";

export const orderService = {
  // User
  create: async (orderData) => {
    const response = await api.post("/orders/new", orderData);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get("/orders/myorders");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  verifyPayment: async (id, paymentResult) => {
    const response = await api.put(`/orders/${id}/pay`, paymentResult);
    return response.data;
  },

  // Admin
  getAllOrders: async () => {
    const response = await api.get("/orders/all");
    return response.data;
  },
  markAsDelivered: async (id) => {
    const response = await api.put(`/orders/${id}/deliver`);
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/orders/dashboard-stats');
    return response.data;
  },
  getWeeklyStats: async (week, year) => {
    const response = await api.get(`/orders/weekly-stats?week=${week}&year=${year}`);
    return response.data;
  },
};