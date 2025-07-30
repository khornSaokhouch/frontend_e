import { create } from 'zustand';
import { request } from '../util/request';

export const useShopOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // Fetch all shop orders
  fetchOrders: async () => {
    set({ loading: true, error: null, currentOrder: null });
    try {
      const response = await request('/shop-orders', 'GET');
      const orders = response?.data || response || [];
      set({ orders, loading: false });
    } catch (err) {
      set({
        error: err?.response?.data?.message || err?.message || 'Failed to fetch orders',
        loading: false,
      });
    }
  },

// Fetch a specific shop order by ID
fetchOrder: async (id) => {
  set({ loading: true, error: null });
  try {
    const order = await request(`/shop-orders/${id}`, 'GET');
    set({ currentOrder: order, loading: false });
    return order; // returning for further use if needed
  } catch (err) {
    set({
      error: err?.response?.data?.message || err?.message || 'Failed to fetch order',
      loading: false,
    });
    return null;
  }
},


 // Fetch orders by user ID
 fetchOrdersByUser: async (userId) => {
  set({ loading: true, error: null });
  try {
    const data = await request(`/shop-orders/user/${userId}`, 'GET');
    set({ orders: data, loading: false });
  } catch (err) {
    set({
      error: err.response?.data?.message || err.message || 'Failed to fetch user orders',
      loading: false,
    });
  }
},


  fetchOrders: async (companyId) => {
    set({ loading: true, error: null, currentOrder: null });
    try {
      const endpoint = companyId ? `/shop-orders?company_id=${companyId}` : "/shop-orders";
      const response = await request(endpoint, "GET");
      const orders = response?.data || response || [];
      set({ orders, loading: false });
    } catch (err) {
      set({
        error: err?.response?.data?.message || err?.message || "Failed to fetch orders",
        loading: false,
      });
    }
  },

  // Create a new shop order
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response = await request('/shop-orders', 'POST', orderData);
      const createdOrder = response.order; // ← Extract the actual order with ID
  
      set((state) => ({
        orders: [...state.orders, createdOrder],
        loading: false,
      }));
  
      return createdOrder;
    } catch (err) {
      set({
        error: err?.response?.data?.message || err?.message || 'Failed to create order',
        loading: false,
      });
      return null;
    }
  },
  

  // Update an existing order
  updateOrder: async (id, orderData) => {
    set({ loading: true, error: null });
    try {
      const updated = await request(`/shop-orders/${id}`, 'PUT', orderData);
      set((state) => ({
        orders: state.orders.map((order) => (order.id === id ? updated : order)),
        loading: false,
      }));
      return updated;
    } catch (err) {
      set({
        error: err?.response?.data?.message || err?.message || 'Failed to update order',
        loading: false,
      });
      return null;
    }
  },

  // Delete an order
  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/shop-orders/${id}`, 'DELETE');
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err?.response?.data?.message || err?.message || 'Failed to delete order',
        loading: false,
      });
      return false;
    }
  },
}));
