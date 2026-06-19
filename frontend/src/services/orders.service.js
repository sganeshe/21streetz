import api from "../lib/api";

export const ordersService = {
  getMyOrders: async () => {
    const res = await api.get("/orders/myorders");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
};
