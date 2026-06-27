import api from "../lib/api";

export const subscriptionService = {
  // Public
  subscribe: async (email) => {
    const response = await api.post("/subscriptions/subscribe", { email });
    return response.data;
  },
  unsubscribe: async (email) => {
    const response = await api.post("/subscriptions/unsubscribe", { email });
    return response.data;
  },
  
};