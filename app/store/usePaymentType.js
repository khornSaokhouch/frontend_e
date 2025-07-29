import { create } from 'zustand';
import { request } from '../util/request';

export const usePaymentTypeStore = create((set, get) => ({
  paymentTypes: [],
  currentPaymentType: null,
  loading: false,
  error: null,

  // Fetch all payment types
  fetchPaymentTypes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/payment-types', 'GET');
      set({ paymentTypes: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch payment types',
        loading: false,
      });
      return null;
    }
  },

  // Fetch one payment type by id
  fetchPaymentType: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/payment-types/${id}`, 'GET');
      set({ currentPaymentType: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch payment type',
        loading: false,
      });
      return null;
    }
  },

  // Create new payment type
  createPaymentType: async (paymentTypeData) => {
    set({ loading: true, error: null });
    try {
      const data = await request('/payment-types', 'POST', paymentTypeData);
      // Add new payment type to list
      set((state) => ({
        paymentTypes: [...state.paymentTypes, data.data],
        loading: false,
      }));
      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to create payment type',
        loading: false,
      });
      return null;
    }
  },

  // Update existing payment type by id
  updatePaymentType: async (id, paymentTypeData) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/payment-types/${id}`, 'PUT', paymentTypeData);
      set((state) => ({
        paymentTypes: state.paymentTypes.map((pt) =>
          pt.id === id ? data.data : pt
        ),
        loading: false,
      }));
      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to update payment type',
        loading: false,
      });
      return null;
    }
  },

  // Delete payment type by id
  deletePaymentType: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/payment-types/${id}`, 'DELETE');
      set((state) => ({
        paymentTypes: state.paymentTypes.filter((pt) => pt.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete payment type',
        loading: false,
      });
      return false;
    }
  },
}));
