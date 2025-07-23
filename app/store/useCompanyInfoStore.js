import { create } from 'zustand';
import { request } from '../util/request';

export const useCompanyInfoStore = create((set, get) => ({
  companies: [],
  company: null,
  loading: false,
  error: null,

  // Update a specific field in the company object
  setFieldValue: (field, value) =>
    set((state) => ({
      company: {
        ...state.company,
        [field]: value,
      },
    })),

  // Generic input handler
  handleInputChange: (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      const file = files && files[0] ? files[0] : null;
      set((state) => ({
        company: {
          ...state.company,
          [name]: file,
        },
      }));
    } else {
      set((state) => ({
        company: {
          ...state.company,
          [name]: value,
        },
      }));
    }
  },

  // Fetch all companies
  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/companies`, 'GET');
      set({ companies: res.companies, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch companies', loading: false });
    }
  },

    fetchCompanyByUserId: async (id) => {
      set({ loading: true, error: null });
      try {
        const res = await request(`/companies/${id}`, 'GET');
        set({ company: res, loading: false }); // ✅ if no `res.company`
      } catch (err) {
        set({ error: err.message || 'Failed to fetch company', loading: false });
      }
    },
  

  // Create a company
  createCompany: async (data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
  
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          if (key === 'company_image') {
            console.log("Appending image:", data[key], typeof data[key]);
          }
          formData.append(key, data[key]);
        }
      }
  
      const res = await request('/companies', 'POST', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // May be auto-set by browser
        },
      });
  
      set({ company: res.company ?? res, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to create company', loading: false });
    }
  },
  

  updateCompany: async (id, data) => {
    set({ loading: true, error: null });
  
    try {
      const formData = new FormData();
  
      for (const key in data) {
        const value = data[key];
  
        if (key === 'company_image') {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            // skip company_image if not a File (do not send invalid values)
            console.log('Skipping company_image: not a valid File');
          }
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
  
      formData.append('_method', 'PUT');
  
      const res = await request(`/companies/${id}`, 'POST', formData);
  
      set({ company: res.company, loading: false });
    } catch (err) {
      console.error("Update error:", err);
      if (err.response && err.response.data) {
        console.error("Backend validation errors:", err.response.data);
      }
      set({ error: err.message || 'Failed to update company', loading: false });
    }
  },
  
  

  // Delete a company
  deleteCompany: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/companies/${id}`, 'DELETE');
      set({ loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to delete company', loading: false });
    }
  },
}));
