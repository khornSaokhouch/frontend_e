import { create } from "zustand";
import { request } from "../util/request";

export const useCartItemStore = create((set, get) => ({
  cartItems: [],
  loading: false,
  error: null,

  fetchCartItems: async (cartId) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/shopping-cart-items?cart_id=${cartId}`, "GET");
      set({ cartItems: data, loading: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch cart items", loading: false });
    }
  },

  addCartItem: async ({ cart_id, product_item_id, qty }) => {
    set({ loading: true, error: null });
    try {
      const newItem = await request(`/shopping-cart-items`, "POST", { cart_id, product_item_id, qty });
      set((state) => ({ cartItems: [...state.cartItems, newItem], loading: false }));
      return newItem;
    } catch (error) {
      set({ error: error.message || "Failed to add item", loading: false });
      throw error;
    }
  },

  updateCartItem: async (id, updateData) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await request(`/shopping-cart-items/${id}`, "PUT", updateData);
      set((state) => ({
        cartItems: state.cartItems.map((item) => (item.id === id ? updatedItem : item)),
        loading: false,
      }));
      return updatedItem;
    } catch (error) {
      set({ error: error.message || "Failed to update item", loading: false });
      throw error;
    }
  },

  removeCartItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/shopping-cart-items/${id}`, "DELETE");
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || "Failed to remove item", loading: false });
      throw error;
    }
  },

  // ✅ NEW METHOD: Checkout single cart item
  checkoutCartItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/shopping-cart-items/${id}/checkout`, "POST");
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || "Failed to checkout item", loading: false });
      throw error;
    }
  },
}));
