// /store/useStocks.js

import { create } from "zustand";
import { request } from "../util/request";

export const useStocks = create((set) => ({
  stocks: [],
  loading: false,
  error: null,

  fetchStocks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/stocks", "GET");
      const stocksData = Array.isArray(res?.data) ? res.data : [];
      set({ stocks: stocksData, loading: false });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch stocks",
        loading: false,
        stocks: [],
      });
    }
  },

  // --- MODIFICATION HERE ---
  // createStock no longer tries to update the state directly.
  createStock: async (data) => {
    try {
      // We just make the request. We don't need to do anything with the response.
      await request("/stocks", "POST", data);
    } catch (error) {
      // Re-throw the error so the component's toast.promise can catch it.
      console.error("Failed to create stock:", error);
      throw error;
    }
  },

  deleteStock: async (id) => {
    try {
      await request(`/stocks/${id}`, "DELETE");
      // For delete, we can optimistically update the UI for a faster feel.
      set((state) => ({
        stocks: state.stocks.filter((stock) => stock.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete stock:", error);
      // If the delete fails, we should re-fetch to get the correct state.
      set((state) => ({ ...state })); // A way to trigger re-render if needed, but re-throwing is better.
      throw error;
    }
  },
}));