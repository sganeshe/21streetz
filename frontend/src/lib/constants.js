export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  ORDERS: `${API_BASE_URL}/orders`,
  SUBSCRIPTIONS: `${API_BASE_URL}/subscriptions`,
  AUTH: `${API_BASE_URL}/auth`,
  COUPONS: `${API_BASE_URL}/coupons`,
};