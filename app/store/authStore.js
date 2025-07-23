import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { request } from "../util/request";
import { useUserStore } from "./userStore";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        // 👇 clear previous user/token before login
        set({ user: null, token: null });
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

          const res = await request("/profile", "GET", null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

      logout: async () => {
        try {
          await request("/logout", "POST", null, {
            Authorization: `Bearer ${get().token}`,
          });
        } catch (err) {
          console.warn("Logout API call failed, but logging out client-side.", err);
        }

        // Clear auth store
        set({ user: null, token: null });

        // Also clear the user store
        useUserStore.getState().clearUser();
      },

      getToken: () => get().token,
    }),
    {
      name: "auth-storage",
      // ✅ use sessionStorage instead of localStorage
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
