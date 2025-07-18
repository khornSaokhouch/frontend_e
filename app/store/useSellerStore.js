// store/useSellerStore.js
import { create } from "zustand";
import { request } from "../util/request"; // Adjust path if needed

export const useSellerStore = create((set) => ({
  form: {
    fullName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    streetAddress: "",
    countryRegion: "",
  },
  loading: false,
  error: null,
  success: null,

  // Handle input change
  handleChange: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      form: {
        ...state.form,
        [name]: value,
      },
      error: null,
      success: null,
    }));
  },

  // Submit form to Laravel backend
  submitForm: async () => {
    set({ loading: true, error: null, success: null });

    try {
      const { form } = useSellerStore.getState();

      const payload = {
        name: form.fullName,
        company_name: form.companyName,
        email: form.email,
        phone_number: form.phoneNumber,
        street_address: form.streetAddress,
        country_region: form.countryRegion,
      };

       const res = await request("/sellers","POST", payload,);
       

      set({
        success: "Your request has been submitted successfully!",
        loading: false,
        form: {
          fullName: "",
          companyName: "",
          email: "",
          phoneNumber: "",
          streetAddress: "",
          countryRegion: "",
        },
      });
    } catch (error) {
      let message = "Something went wrong. Please try again.";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      set({
        error: message,
        loading: false,
      });
    }
  },
}));
