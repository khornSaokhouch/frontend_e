import { create } from "zustand";
import { request } from "../util/request"; // Adjust path if needed

export const useStore = create((set) => ({
  stores: [],
  loading: false, // This is for the main fetchStores list
  error: null,

  fetchStores: async () => {
    // This is a global loading state, appropriate for fetching the main list
    set({ loading: true, error: null });
    try {
      const res = await request("/stores", "GET");
      // It's good practice to ensure the response is an array
      set({ stores: Array.isArray(res) ? res : [], loading: false });
    } catch (err) {
      set({ error: "Failed to fetch stores", loading: false, stores: [] });
    }
  },

  // IMPROVEMENT 1: Removed state setting. This is now a pure data-fetching utility.
  // The component calling this should manage its own loading/error state if needed.
  getStoreById: async (id) => {
    try {
      const res = await request(`/stores/${id}`, "GET");
      return res;
    } catch (err) {
      console.error("Failed to fetch store by ID:", err);
      // It doesn't set global state, just returns null on failure.
      return null;
    }
  },

  createStore: async (data) => {
    try {
      const newStore = await request("/stores", "POST", data);
      // It's good practice to check if the API returned a valid object
      if (!newStore || !newStore.id) {
          throw new Error("Invalid response from server on create.");
      }
      set((state) => ({
        stores: [...state.stores, newStore],
      }));
      return newStore; // Return the newly created store
    } catch (err) {
      // IMPROVEMENT 2: Re-throw the error so the component can catch it.
      // This works perfectly with toast.promise or try/catch in the component.
      console.error("Failed to create store:", err);
      throw err;
    }
  },

  updateStore: async (id, data) => {
    try {
      const updatedStore = await request(`/stores/${id}`, "PUT", data);
      if (!updatedStore || !updatedStore.id) {
          throw new Error("Invalid response from server on update.");
      }
      set((state) => ({
        stores: state.stores.map((s) => (s.id === id ? updatedStore : s)),
      }));
      return updatedStore;
    } catch (err) {
      // IMPROVEMENT 2: Re-throw the error.
      console.error("Failed to update store:", err);
      throw err;
    }
  },

  deleteStore: async (id) => {
    try {
      await request(`/stores/${id}`, "DELETE");
      set((state) => ({
        stores: state.stores.filter((s) => s.id !== id),
      }));
      // On success, we don't need to return anything, but we could return true.
    } catch (err) {
      // IMPROVEMENT 2: Re-throw the error.
      console.error("Failed to delete store:", err);
      throw err;
    }
  },
}));