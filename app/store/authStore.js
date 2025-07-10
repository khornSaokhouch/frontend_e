import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { request } from "../util/request";
import { useUserStore } from "./userStore"; // ✅ 1. IMPORT THE USER STORE

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      // ... (your login, register, and loginWithToken functions are perfect, no changes needed)
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await request("/login", "POST", { email, password });
          const { user, token } = res || {};
          if (!user || !token) throw new Error("Invalid login response.");
          set({ user, token });
          return { user, token };
        } catch (err) {
          const msg = err?.message || "Login failed";
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ loading: false });
        }
      },

      register: async ({ name, email, password, password_confirmation }) => {
        set({ loading: true, error: null });
        try {
          const res = await request("/register", "POST", {
            name,
            email,
            password,
            password_confirmation,
          });
      
          const { user, token } = res || {};
          if (!user || !token) throw new Error("Invalid registration response.");
          set({ user, token });
          return { user, token };
        } catch (err) {
          const msg = err?.response?.data?.message || err.message || "Registration failed";
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ loading: false });
        }
      },      

      loginWithToken: async (token) => {
        set({ loading: true, error: null });
        try {
          set({ token });

          const res = await request("/user", "GET", null, {
            Authorization: `Bearer ${token}`,
          });

          if (!res?.user) throw new Error("Failed to fetch user data.");
          set({ user: res.user });
          return res.user;
        } catch (err) {
          set({ user: null, token: null, error: err.message || "Login with token failed" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // Logout
      logout: async () => {
        try {
          await request("/logout", "POST", null, {
            Authorization: `Bearer ${get().token}`,
          });
        } catch (err) {
          console.warn("Logout API call failed, but logging out client-side.", err);
        }
        
        // This clears the auth store
        set({ user: null, token: null });

        // ✅ 2. ADD THIS LINE TO CLEAR THE USER PROFILE STORE
        // This is the crucial fix.
        useUserStore.getState().clearUser();
      },

      // Token getter
      getToken: () => get().token,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);