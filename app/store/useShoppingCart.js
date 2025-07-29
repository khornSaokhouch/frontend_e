import { create } from "zustand";
import { request } from "../util/request";

export const useShoppingCartStore = create((set, get) => ({
  carts: [],
  selectedCart: null,
  loading: false,
  error: null,
  currentUserId: null,  // Track current user id

  setCurrentUserId: (userId) => set({ currentUserId: userId }),

  fetchShoppingCarts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/shopping-carts", "GET");
      set({ carts: res.data, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch carts", loading: false });
    }
  },

  fetchCartsByUserId: async (userId) => {
    set({ loading: true, error: null });
    try {
      const carts = await request(`/shopping-carts?user_id=${userId}`, "GET");
      set({ carts, loading: false }); // ✅ No more .data
    } catch (err) {
      console.error("Failed to fetch carts for user", err);
      set({
        error: err.message || "Failed to fetch carts for user",
        loading: false,
      });
    }
  },

  
  
  
  

  createCart: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await request("/shopping-carts", "POST", payload);
      // Refresh based on current user filter if set
      const userId = get().currentUserId;
      if (userId) await get().fetchCartsByUserId(userId);
      else await get().fetchShoppingCarts();
      return res.data;
    } catch (err) {
      set({ error: err.message || "Failed to create cart", loading: false });
    } finally {
      set({ loading: false });
    }
  },

  updateCart: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      if (!payload.user_id) {
        const userId = get().currentUserId;
        if (!userId) throw new Error("User ID is missing");
        payload.user_id = userId;
      }
      const res = await request(`/shopping-carts/${id}`, "PUT", payload);
      const userId = get().currentUserId;
      if (userId) {
        await get().fetchCartsByUserId(userId);
      } else {
        await get().fetchShoppingCarts();
      }
      return res.data;
    } catch (err) {
      set({ error: err.message || "Failed to update cart", loading: false });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  
  
  
  deleteCart: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/shopping-carts/${id}`, "DELETE");
      const userId = get().currentUserId;
      if (userId) await get().fetchCartsByUserId(userId);
      else await get().fetchShoppingCarts();
    } catch (err) {
      set({ error: err.message || "Failed to delete cart", loading: false });
    } finally {
      set({ loading: false });
    }
  },

  fetchCartById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/shopping-carts/${id}`, "GET");
      set({ selectedCart: res.data, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch cart", loading: false });
    }
  },

  clearSelectedCart: () => set({ selectedCart: null }),
}));

