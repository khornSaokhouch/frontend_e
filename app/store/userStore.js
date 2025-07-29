import { create } from 'zustand';
import { request } from '../util/request';

export const useUserStore = create((set, get) => ({
  user: null, // current logged-in user
  users: [],
  loading: false,
  error: null,


fetchUser: async () => {
  set({ loading: true, error: null });
  try {
    const res = await request('/profile', 'GET'); // use /profile endpoint that returns { user }
    set({ user: res.user, loading: false });
    return res.user;
  } catch (err) {
    set({
      error: err.response?.data?.message || err.message || 'Failed to fetch user',
      loading: false,
    });
    return null;
  }
},

  

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/users/${id}`, 'GET', null, true);
      set({ user: res, loading: false }); // res is the user object itself
    } catch (err) {
      console.error("Error fetching user:", err);
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
      const data = await request(`/users/${id}`, 'POST', updatedData, {
        'Content-Type': 'multipart/form-data',
      });

      const currentUser = get().user;
      if (currentUser && currentUser.id === id) {
        set({ user: data });
      }

      const currentSelected = get().selectedUser;
      if (currentSelected && currentSelected.id === id) {
        set({ selectedUser: data });
      }

      set((state) => ({
        users: state.users.map(u => u.id === id ? data : u),
      }));

    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Update failed');
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/users/${id}`, 'DELETE');
      set((state) => ({
        users: state.users.filter(user => (user.user_id ?? user.id) !== id),
        loading: false,
      }));
    } catch (err) {
      console.error("Error deleting user:", err);
      set({ error: err.message || 'Failed to delete user', loading: false });
      throw err; // rethrow so caller can catch (e.g. for toast)
    }
  },

  clearUser: () => set({ user: null, loading: false, error: null }),
  clearUsers: () => set({ users: [], loading: false, error: null }),
}));
