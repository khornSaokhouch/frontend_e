import { create } from 'zustand';
import { request } from '../util/request';

export const useUserStore = create((set, get) => ({
  user: null,
  users: [],
  loading: false,
  error: null,

  // fetchUser: async () => {
  //   set({ loading: true, error: null });
  //   try {
  //     const res = await request('/profile', 'GET');
  //      set({ user: res.user, loading: false });  // <- unwrap here
  //   } catch (err) {
  //     set({ error: err.message || 'Failed to fetch user', loading: false });
  //   }
  // },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/profile', 'GET'); // endpoint for current logged-in user info
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
      console.error("Error fetching user:", err); // 🔥 Debug network error
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
  
      // If you updated the logged-in user, update 'user'
      const currentUser = get().user;
      if (currentUser && currentUser.id === id) {
        set({ user: data });
      }
  
      // If you updated the selected user (being edited/viewed), update selectedUser
      const currentSelected = get().selectedUser;
      if (currentSelected && currentSelected.id === id) {
        set({ selectedUser: data });
      }
  
      // Also update the users list in state (if you have one)
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
      // Remove the deleted user from the users array in state
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
      }));
    } catch (err) {
      console.error("Error deleting user:", err);
      set({ error: err.message || 'Failed to delete user', loading: false });
    }
  },
  
  
  
  // ✅ UPDATED: This function now fully resets the user state
  clearUser: () => set({ user: null, loading: false, error: null }),

  // This one is also improved for consistency
  clearUsers: () => set({ users: [], loading: false, error: null }),
}));