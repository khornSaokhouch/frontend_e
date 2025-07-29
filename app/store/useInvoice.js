import { create } from 'zustand';
import { request } from '../util/request';

export const useInvoiceStore = create((set, get) => ({
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,

  // Fetch all invoices
  fetchInvoices: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/invoices', 'GET');
      set({ invoices: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch invoices',
        loading: false,
      });
      return null;
    }
  },

  // Fetch single invoice
  fetchInvoice: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/invoices/${id}`, 'GET');
      set({ currentInvoice: data, loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch invoice',
        loading: false,
      });
      return null;
    }
  },

  // Create new invoice
  createInvoice: async (invoiceData) => {
    set({ loading: true, error: null });
    try {
      const res = await request('/invoices', 'POST', invoiceData);
      set((state) => ({
        invoices: [...state.invoices, res.data],
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to create invoice',
        loading: false,
      });
      return null;
    }
  },

  // Update invoice
  updateInvoice: async (id, invoiceData) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/invoices/${id}`, 'PUT', invoiceData);
      set((state) => ({
        invoices: state.invoices.map((inv) => (inv.id === id ? res.data : inv)),
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to update invoice',
        loading: false,
      });
      return null;
    }
  },

  // Delete invoice
  deleteInvoice: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/invoices/${id}`, 'DELETE');
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete invoice',
        loading: false,
      });
      return false;
    }
  },
}));
