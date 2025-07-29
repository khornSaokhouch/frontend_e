import { create } from 'zustand';
import { request } from '../util/request';

export const useOrderLineStore = create((set, get) => ({
  orderLines: [],
  currentOrderLine: null,
  loading: false,
  error: null,

  fetchOrderLines: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/order-lines', 'GET');
      set({ orderLines: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch order lines',
        loading: false,
      });
    }
  },

  createOrderLine: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await request('/order-lines', 'POST', data);
      set((state) => ({
        orderLines: [...state.orderLines, res.data],
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to create order line',
        loading: false,
      });
    }
  },

  updateOrderLine: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/order-lines/${id}`, 'PUT', data);
      set((state) => ({
        orderLines: state.orderLines.map((line) =>
          line.id === id ? res.data : line
        ),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to update order line',
        loading: false,
      });
    }
  },

  deleteOrderLine: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/order-lines/${id}`, 'DELETE');
      set((state) => ({
        orderLines: state.orderLines.filter((line) => line.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to delete order line',
        loading: false,
      });
    }
  },
}));
