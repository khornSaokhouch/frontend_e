import { create } from 'zustand';
import { request } from '../util/request'; // your custom fetch wrapper

export const usePromotionsStore = create((set) => ({
  promotions: [],
  loading: false,
  error: null,

  fetchPromotions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/promotions', 'GET');
      set({ promotions: res || [], loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch promotions', loading: false });
    }
  },

  createPromotion: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await request('/promotions', 'POST', data);
      set((state) => ({ promotions: [...state.promotions, res], loading: false }));
      return res;
    } catch (err) {
      set({ error: err.message || 'Failed to create promotion', loading: false });
      throw err;
    }
  },

  updatePromotion: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/promotions/${id}`, 'PUT', data);
      set((state) => ({
        promotions: state.promotions.map((promo) => (promo.id === id ? res : promo)),
        loading: false,
      }));
      return res;
    } catch (err) {
      set({ error: err.message || 'Failed to update promotion', loading: false });
      throw err;
    }
  },

  deletePromotion: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/promotions/${id}`, 'DELETE');
      set((state) => ({
        promotions: state.promotions.filter((promo) => promo.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to delete promotion', loading: false });
      throw err;
    }
  },
}));
