import { create } from 'zustand';
import { request } from '../util/request';

export const useShippingMethodStore = create((set, get) => ({
  shippingMethods: [],
  currentShippingMethod: null,
  loading: false,
  error: null,

  // Fetch all shipping methods
  fetchShippingMethods: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/shipping-methods', 'GET');
      set({ shippingMethods: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch shipping methods',
        loading: false,
      });
      return null;
    }
  },

  // Fetch one shipping method by id
  fetchShippingMethod: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/shipping-methods/${id}`, 'GET');
      set({ currentShippingMethod: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch shipping method',
        loading: false,
      });
      return null;
    }
  },

  // Create new shipping method
  createShippingMethod: async (shippingMethodData) => {
    set({ loading: true, error: null });
    try {
      const data = await request('/shipping-methods', 'POST', shippingMethodData);
      set((state) => ({
        shippingMethods: [...state.shippingMethods, data.data],
        loading: false,
      }));
      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to create shipping method',
        loading: false,
      });
      return null;
    }
  },

  // Update existing shipping method by id
  updateShippingMethod: async (id, shippingMethodData) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/shipping-methods/${id}`, 'PUT', shippingMethodData);
      set((state) => ({
        shippingMethods: state.shippingMethods.map((sm) =>
          sm.id === id ? data.data : sm
        ),
        loading: false,
      }));
      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to update shipping method',
        loading: false,
      });
      return null;
    }
  },

  // Delete shipping method by id
  deleteShippingMethod: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/shipping-methods/${id}`, 'DELETE');
      set((state) => ({
        shippingMethods: state.shippingMethods.filter((sm) => sm.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete shipping method',
        loading: false,
      });
      return false;
    }
  },
}));
