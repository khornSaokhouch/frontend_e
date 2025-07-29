import { create } from 'zustand';
import { request } from '../util/request';

export const useFavouritesStore = create((set) => ({
  favourites: [],
  loading: false,
  error: null,

  fetchFavourites: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/favourites/${id}`, 'GET');
      set({ favourites: res || [], loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch favourites', loading: false });
    }
  },
  
  

  addFavourite: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await request('/favourites', 'POST', payload);
      set((state) => ({
        favourites: [...state.favourites, res.data],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to add favourite', loading: false });
    }
  },

  removeFavourite: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/favourites/${id}`, 'DELETE');
      set((state) => ({
        favourites: state.favourites.filter((fav) => fav.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to remove favourite', loading: false });
    }
  },

  getFavouriteById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/favourites/${id}`, 'GET');
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message || 'Failed to fetch favourite', loading: false });
      return null;
    }
  },
}));
