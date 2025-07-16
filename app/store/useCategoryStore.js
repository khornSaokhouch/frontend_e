import { create } from 'zustand';
import { request } from '../util/request'; // adjust path as needed

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  search: '',

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/categories', 'GET');
      set({ categories: data, loading: false });
    } catch (e) {
      set({ error: e.response?.data?.message || e.message || 'Failed to fetch categories', loading: false });
    }
  },

  setSearch: (value) => set({ search: value }),

  saveCategory: async (category) => {
    try {
      let url = '/categories';
      let method = 'POST';
  
      if (category.id) {
        url = `/categories/${category.id}`;
        method = 'POST';
      }
  
      const formData = new FormData();
      formData.append('name', category.name);
  
      if (category.image) {
        formData.append('image', category.image);
      }
  
      await request(url, method, formData, {
        // Do NOT set Content-Type manually here
      });
  
      await get().fetchCategories();
    } catch (err) {
      throw err;
    }
  },
  
  

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/categories/${id}`, 'DELETE');
      await get().fetchCategories();
      set({ loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Failed to delete category', loading: false });
      throw err;
    }
  },
}));
