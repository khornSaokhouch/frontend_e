import { create } from 'zustand';
import { request } from '../util/request'; // Your API request util

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/products', 'GET', null, false);
      // No res.products or res.data — just the array itself
      set({ products: res || [], loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch products', loading: false });
    }
  },




  fetchAllProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/products', 'GET');
      set({ products: res, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch products',
        loading: false,
      });
    }
  },
  

  fetchCategoryById: async (categoryId) => {
    try {
      const data = await request(`/categories/${categoryId}`, 'GET');
      return data; // assuming data contains category info including `name`
    } catch (e) {
      console.error('Failed to fetch category:', e);
      return null;
    }
  },
  

  fetchProductsByCategory: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/categories/${categoryId}/products`, 'GET');
      set({ products: data, loading: false });
    } catch (e) {
      set({
        error: e?.response?.data?.message || e.message || 'Failed to fetch products',
        loading: false,
      });
    }
  },
  


  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/products/${id}`, 'GET');
      set({ product: res, loading: false }); // Use `res` or `res.data` depending on your request() utility
    } catch (err) {
      set({ error: err.message || 'Failed to fetch product', loading: false });
    }
  },
  
  
  createProduct: async (data) => {
    set({ loading: true, error: null });
    try {
      // if product_image is a file, send as FormData
      const formData = new FormData();
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }

      const res = await request('/products', 'POST', formData, {
        // headers are handled automatically for FormData
      });

      set((state) => ({
        products: [...state.products, res.product],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to create product', loading: false });
    }
  },

  updateProduct: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          if (key === "product_image") {
            if (data[key] instanceof File) {
              formData.append(key, data[key]);
            }
          } else {
            formData.append(key, data[key]);
          }
        }
      }
      formData.append('_method', 'PUT');
  
      const res = await request(`/products/${id}`, 'POST', formData);
  
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? res.product : p)),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to update product', loading: false });
    }
  },
  
  

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/products/${id}`, 'DELETE');
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to delete product', loading: false });
    }
  },
}));

