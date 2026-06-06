import { ENDPOINTS } from '../lib/constants';

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await fetch(ENDPOINTS.PRODUCTS);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch single product details
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${ENDPOINTS.PRODUCTS}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Submit an order to backend/controllers/order.controller.js
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(ENDPOINTS.ORDERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  } catch (error) {
    console.error("Order creation failed:", error);
    throw error;
  }
};