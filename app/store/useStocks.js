import { create } from "zustand";
import {request} from "../util/request"; // Make sure this points to your fetch wrapper

export const useStocks = create((set) => ({
  stocks: [],
  loading: false,
  error: null,

  fetchStocks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/stocks", "GET");
      set({ stocks: res.data, loading: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch stocks", loading: false });
    }
  },

  createStock: async (data) => {
    try {
      const res = await request("/stocks", "POST", data);
      set((state) => ({
        stocks: [...state.stocks, res.data],
      }));
    } catch (error) {
      set({ error: error.message || "Failed to create stock" });
    }
  },

  updateStock: async (id, data) => {
    try {
      const res = await request(`/stocks/${id}`, "PUT", data);
      set((state) => ({
        stocks: state.stocks.map((stock) =>
          stock.id === id ? res.data : stock
        ),
      }));
    } catch (error) {
      set({ error: error.message || "Failed to update stock" });
    }
  },

  deleteStock: async (id) => {
    try {
      await request(`/stocks/${id}`, "DELETE");
      set((state) => ({
        stocks: state.stocks.filter((stock) => stock.id !== id),
      }));
    } catch (error) {
      set({ error: error.message || "Failed to delete stock" });
    }
  },
}));
