import { create } from "zustand";
import { request } from "../util/request";

export const useReviewStore = create((set) => ({
  reviews: [],
  review: null,
  loading: false,
  error: null,

  // Fetch reviews with optional filters for userId and productId
  fetchReviews: async (userId = null, productId = null) => {
    set({ loading: true, error: null });
    try {
      let url = "/user-reviews";
      const params = new URLSearchParams();

      if (userId) params.append("user_id", userId);
      // NOTE: Ensure your API uses 'product_id' as the query parameter
      if (productId) params.append("product_id", productId);

      if ([...params].length > 0) {
        url += `?${params.toString()}`;
      }

      const res = await request(url, "GET");
      set({
        reviews: Array.isArray(res) ? res : [],
        loading: false,
        error: null,
      });
    } catch (err) {
      set({ error: "Failed to fetch reviews", loading: false, reviews: [] });
    }
  },
  
  // Create a new review
  createReview: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await request("/user-reviews", "POST", data);
      set((state) => ({
        // Optimistically add the new review to the top of the list
        reviews: [res, ...state.reviews], 
        loading: false,
        error: null,
      }));
      return res;
    } catch (err) {
      set({ error: "Failed to create review", loading: false });
      throw err;
    }
  },

  // Update existing review by id
  updateReview: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/user-reviews/${id}`, "PUT", data);
      set((state) => ({
        // Optimistically update the specific review in the list
        reviews: state.reviews.map((r) => (r.id === id ? { ...r, ...res } : r)),
        loading: false,
        error: null,
      }));
      return res;
    } catch (err) {
      set({ error: "Failed to update review", loading: false });
      throw err;
    }
  },

  // Delete review by id
  deleteReview: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/user-reviews/${id}`, "DELETE");
      set((state) => ({
        // Optimistically remove the review from the list
        reviews: state.reviews.filter((r) => r.id !== id),
        loading: false,
        error: null,
      }));
    } catch (err) {
      set({ error: "Failed to delete review", loading: false });
      throw err;
    }
  },
}));