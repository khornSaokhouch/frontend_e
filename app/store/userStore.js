import { create } from 'zustand';
import { request } from '../util/request';

export const useUserStore = create((set, get) => ({
  user: null,
  users: [],
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/profile', 'GET');
      set({ user: res, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch user', loading: false });
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/users/${id}`, 'GET');
      set({ user: res, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch user', loading: false });
    }
  },

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/users', 'GET');
      set({ users: res, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch users',
        loading: false,
      });
    }
  },
  
  updateUser: async (id, updatedData) => {
    try {
      // Note: No loading state here, as the component handles its own 'isSubmitting' state. This is fine.
      const data = await request(`/users/${id}`, 'POST', updatedData, {
        'Content-Type': 'multipart/form-data',
      });
      // Update the user state with the fresh data from the server
      set({ user: data }); 
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Update failed');
    }
  },
  
  // ✅ UPDATED: This function now fully resets the user state
  clearUser: () => set({ user: null, loading: false, error: null }),

  // This one is also improved for consistency
  clearUsers: () => set({ users: [], loading: false, error: null }),
}));