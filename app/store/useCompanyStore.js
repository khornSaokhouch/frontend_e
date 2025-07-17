// useCompanyStore.js
import { create } from 'zustand';
import { request } from '../util/request';

export const useCompanyStore = create((set, get) => ({
  companies: [],
  loading: false,
  error: null,

  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/sellers', 'GET');  // Your API endpoint
      set({ companies: data, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch sellers', loading: false });
    }
  },

  approveCompany: async (companyId) => {
    set({ loading: true, error: null });
    try {
      // Assuming your API endpoint for approving a company is something like PUT /sellers/{companyId}/approve
      const response = await request(`/sellers/${companyId}/approve`, 'PUT');
      set((state) => ({
        // Update the status of the specific company in the local state
        companies: state.companies.map((company) =>
          company.id === companyId ? { ...company, status: 'approved' } : company
        ),
        loading: false,
      }));
      return response; // Return the API response if needed
    } catch (err) {
      set({ error: err.message || `Failed to approve company ${companyId}`, loading: false });
      throw err; // Re-throw the error for component-level handling
    }
  },

  rejectCompany: async (companyId) => {
    set({ loading: true, error: null });
    try {
      // Assuming your API endpoint for rejecting a company is something like PUT /sellers/{companyId}/reject
      const response = await request(`/sellers/${companyId}/reject`, 'PUT');
      set((state) => ({
        // Update the status of the specific company in the local state
        companies: state.companies.map((company) =>
          company.id === companyId ? { ...company, status: 'rejected' } : company
        ),
        loading: false,
      }));
      return response; // Return the API response if needed
    } catch (err) {
      set({ error: err.message || `Failed to reject company ${companyId}`, loading: false });
      throw err; // Re-throw the error for component-level handling
    }
  },
}));