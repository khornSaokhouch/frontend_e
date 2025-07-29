import { create } from 'zustand';
import { request } from '../util/request';

export const useOrderStatusStore = create((set, get) => ({
  orderStatuses: [],
  currentOrderStatus: null,
  loading: false,
  error: null,

  // Fetch all order statuses
  fetchOrderStatuses: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/order-statuses', 'GET');
      set({ orderStatuses: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch order statuses',
        loading: false,
      });
      return null;
    }
  },

  // Fetch one order status by id
  fetchOrderStatus: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/order-statuses/${id}`, 'GET');
      set({ currentOrderStatus: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch order status',
        loading: false,
      });
      return null;
    }
  },

  // Create new order status
  createOrderStatus: async (orderStatusData) => {
    set({ loading: true, error: null });
    try {
      const data = await request('/order-statuses', 'POST', orderStatusData);
      set((state) => ({
        orderStatuses: [...state.orderStatuses, data.data],
        loading: false,
      }));
      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to create order status',
        loading: false,
      });
      return null;
    }
  },

   // ✅ Update order status by order ID
   updateOrderStatus: async (orderId, statusId) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/shop-orders/${orderId}/status`, 'PATCH', {
        order_status_id: statusId,
      });
      set({ currentOrderStatus: data.order?.order_status || null, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to update order status',
        loading: false,
      });
      return null;
    }
  },

// Delete shop order by ID
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
      error: err.response?.data?.message || err.message || 'Failed to delete order',
      loading: false,
    });
    return false;
  }
},

}));
