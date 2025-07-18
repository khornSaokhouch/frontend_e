import { create } from 'zustand';
import { request } from '../util/request'; // Adjust if needed

export const useCompanyInfoStore = create((set, get) => ({
  companyData: null,
  originalData: null,
  loading: false,
  error: null,
  success: null,

  fetchCompanyInfo: async (id) => {
    if (!id || id === 'new') {
      // Initialize empty data for new company
      set({
        companyData: {
          company_name: '',
          description: '',
          website_url: '',
          business_hours: '',
          location: {
            address: '',
            city: '',
            country: '',
          },
          social_links: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
          },
          company_image: '',
        },
        originalData: null,
        loading: false,
        error: null,
        success: null,
      });
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await request(`/companies/${id}`, 'GET');
      set({
        companyData: JSON.parse(JSON.stringify(data)),
        originalData: JSON.parse(JSON.stringify(data)),
        loading: false,
        success: null,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch company info.',
        loading: false,
      });
    }
  },

  setFieldValue: (path, value) => {
    const current = JSON.parse(JSON.stringify(get().companyData));
    const keys = path.split('.');
    let obj = current;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    set({ companyData: current });
  },

  saveCompanyInfo: async () => {
    const { companyData, originalData } = get();

    if (!companyData) {
      set({ error: 'No company data to save.' });
      return;
    }

    set({ loading: true, error: null, success: null });

    try {
      let saved;
      if (originalData) {
        // Update existing company
        saved = await request(`/companies/${companyData.id}`, 'PUT', companyData);
      } else {
        // Create new company
        saved = await request('/companies', 'POST', companyData);
      }

      set({
        companyData: JSON.parse(JSON.stringify(saved)),
        originalData: JSON.parse(JSON.stringify(saved)),
        loading: false,
        success: originalData ? 'Company info updated successfully.' : 'Company created successfully.',
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to save company.',
        loading: false,
      });
    }
  },

  revertChanges: () => {
    const original = get().originalData;
    if (original) {
      set({
        companyData: JSON.parse(JSON.stringify(original)),
        error: null,
        success: null,
      });
    } else {
      // Reset form for new company
      set({
        companyData: {
          company_name: '',
          description: '',
          website_url: '',
          business_hours: '',
          location: {
            address: '',
            city: '',
            country: '',
          },
          social_links: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
          },
          company_image: '',
        },
        error: null,
        success: null,
      });
    }
  },
}));
