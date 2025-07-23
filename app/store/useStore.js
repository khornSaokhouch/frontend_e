import { create } from "zustand";
import {request} from "../util/request"; // Adjust path if needed

export const useStore = create((set) => ({
  stores: [],
  loading: false,
  error: null,

  fetchStores: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/stores", "GET");
      set({ stores: res, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch stores", loading: false });
    }
  },

  getStoreById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/stores/${id}`, "GET");
      return res;
    } catch (err) {
      set({ error: "Failed to fetch store", loading: false });
      return null;
    }
  },

  createStore: async (data) => {
    try {
      const res = await request("/stores", "POST", data);
      set((state) => ({
        stores: [...state.stores, res],
      }));
      return res;
    } catch (err) {
      set({ error: "Failed to create store" });
    }
  },

  updateStore: async (id, data) => {
    try {
      const res = await request(`/stores/${id}`, "PUT", data);
      set((state) => ({
        stores: state.stores.map((s) => (s.id === id ? res : s)),
      }));
      return res;
    } catch (err) {
      set({ error: "Failed to update store" });
    }
  },

  deleteStore: async (id) => {
    try {
      await request(`/stores/${id}`, "DELETE");
      set((state) => ({
        stores: state.stores.filter((s) => s.id !== id),
      }));
    } catch (err) {
      set({ error: "Failed to delete store" });
    }
  },
}));
