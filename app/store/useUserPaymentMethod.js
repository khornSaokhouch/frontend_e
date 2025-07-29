import { create } from 'zustand';
import { request } from '../util/request';

export const useUserPaymentMethodStore = create((set) => ({
  userPaymentMethods: [],
  currentUserPaymentMethod: null,
  loading: false,
  error: null,

  // Fetch all user payment methods (optionally by userId)
  fetchUserPaymentMethods: async (userId) => {
    set({ loading: true, error: null });
    try {
      const url = userId ? `/user-payment-methods?user_id=${userId}` : '/user-payment-methods';
      const data = await request(url, 'GET');
      set({ userPaymentMethods: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch user payment methods',
        loading: false,
      });
      return null;
    }
  },

  // Fetch a single user payment method by ID
  fetchUserPaymentMethodById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/user-payment-methods/${id}`, 'GET');
      set({ currentUserPaymentMethod: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch user payment method',
        loading: false,
      });
      return null;
    }
  },

  // Create a new user payment method
  createUserPaymentMethod: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await request('/user-payment-methods', 'POST', payload);
      set((state) => ({
        userPaymentMethods: [...state.userPaymentMethods, data],
        loading: false,
      }));
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to create user payment method',
        loading: false,
      });
      return null;
    }
  },

  // Update existing user payment method
  updateUserPaymentMethod: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/user-payment-methods/${id}`, 'PUT', payload);
      set((state) => ({
        userPaymentMethods: state.userPaymentMethods.map((item) =>
          item.id === id ? data : item
        ),
        loading: false,
      }));
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to update user payment method',
        loading: false,
      });
      return null;
    }
  },

  // Delete a user payment method
  deleteUserPaymentMethod: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/user-payment-methods/${id}`, 'DELETE');
      set((state) => ({
        userPaymentMethods: state.userPaymentMethods.filter((item) => item.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete user payment method',
        loading: false,
      });
      return false;
    }
  },
}));
