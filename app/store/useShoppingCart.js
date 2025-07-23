import { create } from "zustand";
import { request } from "../util/request";

export const useShoppingCartItem = create((set, get) => ({
  items: [],
  selectedItem: null,
  loading: false,
  error: null,

  // GET /shopping-cart-items
  fetchShoppingCartItems: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/shopping-cart-items", "GET");
      set({ items: res.data, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch cart items", loading: false });
    }
  },

  // GET /shopping-cart-items/{id}
  fetchShoppingCartItemById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/shopping-cart-items/${id}`, "GET");
      set({ selectedItem: res.data, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch cart item", loading: false });
    }
  },

  // POST /shopping-cart-items
  createShoppingCartItem: async ({ cart_id, product_item_id, qty }) => {
    set({ loading: true, error: null });
    try {
      const res = await request("/shopping-cart-items", "POST", {
        cart_id,
        product_item_id,
        qty,
      });
      await get().fetchShoppingCartItems(); // Refresh list
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message || "Failed to create cart item", loading: false });
    }
  },

  // PUT /shopping-cart-items/{id}
  updateShoppingCartItem: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/shopping-cart-items/${id}`, "PUT", data);
      await get().fetchShoppingCartItems(); // Refresh list
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message || "Failed to update cart item", loading: false });
    }
  },

  // DELETE /shopping-cart-items/{id}
  deleteShoppingCartItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/shopping-cart-items/${id}`, "DELETE");
      await get().fetchShoppingCartItems(); // Refresh list
      set({ loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to delete cart item", loading: false });
    }
  },

  clearSelectedItem: () => set({ selectedItem: null }),
}));
