import { create } from 'zustand';
import { request } from '../util/request';

export const useUserPaymentMethodStore = create((set) => ({
  userPaymentMethods: [],
  currentUserPaymentMethod: null,
  loading: false,
  error: null,

  // Fetch all user payment methods (optionally filtered by userId)
  fetchUserPaymentMethods: async (userId) => {
    set({ loading: true, error: null });
    try {
      const url = userId ? `/user-payment-methods?user_id=${userId}` : '/user-payment-methods';
      const data = await request(url, 'GET');
      // Defensive: ensure data is array
      set({ userPaymentMethods: Array.isArray(data) ? data : [], loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch user payment methods',
        loading: false,
      });
      return null;
    }
  },

  // Fetch a single payment method by ID
  fetchUserPaymentMethodById: async (id) => {
    set({ loading: true, error: null });
    try {
      if (!id) throw new Error('Payment method ID is required');
      const data = await request(`/user-payment-methods/${id}`, 'GET');
      set({ currentUserPaymentMethod: data || null, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch payment method',
        loading: false,
      });
      return null;
    }
  },

  // Create a new payment method
  createUserPaymentMethod: async (paymentMethod) => {
    set({ loading: true, error: null });
    try {
      if (!paymentMethod) throw new Error('Payment method data is required');
      const data = await request('/user-payment-methods', 'POST', paymentMethod);
      set((state) => ({
        userPaymentMethods: [...state.userPaymentMethods, data],
        loading: false,
      }));
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to create payment method',
        loading: false,
      });
      return null;
    }
  },

  // Update an existing payment method by ID
  updateUserPaymentMethod: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      if (!id || !updates) throw new Error('Payment method ID and updates are required');
      const data = await request(`/user-payment-methods/${id}`, 'PUT', updates);
      set((state) => ({
        userPaymentMethods: state.userPaymentMethods.map((pm) =>
          pm.id === id ? data : pm
        ),
        loading: false,
      }));
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to update payment method',
        loading: false,
      });
      return null;
    }
  },

  // Delete a payment method by ID
  deleteUserPaymentMethod: async (id) => {
    set({ loading: true, error: null });
    try {
      if (!id) throw new Error('Payment method ID is required');
      await request(`/user-payment-methods/${id}`, 'DELETE');
      set((state) => ({
        userPaymentMethods: state.userPaymentMethods.filter((pm) => pm.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete payment method',
        loading: false,
      });
      return false;
    }
  },
}));
