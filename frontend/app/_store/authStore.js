import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      name: null,
      token: null,
      role: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(
            "http://localhost:3000/api/v1/auth/signin",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          set({
            name: data.user?.name,
            token: data.token,
            role: data.user?.role,
            loading: false,
          });
          return true;
        } catch (error) {
          toast.error(error.message);
          set({
            error: error.message || "Login failed",
            loading: false,
          });
          return false;
        }
      },

      register: async (name, email, password, rePassword) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(
            "http://localhost:3000/api/v1/auth/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, email, password, rePassword }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Registration failed");
          }

          set({
            loading: false,
          });
          return true;
        } catch (error) {
          toast.error(error.message);
          set({
            error: error.message || "Registration failed",
            loading: false,
          });
          return false;
        }
      },

      changePassword: async (oldPassword, newPassword) => {
        set({ loading: true, error: null });
        try {
          const { token } = get();
          if (!token) throw new Error("Not authenticated");

          const response = await fetch(
            "http://localhost:3000/api/v1/auth/changePassword",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ oldPassword, newPassword }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Password change failed");
          }

          set({ loading: false });
          return true;
        } catch (error) {
          set({
            error: error.message || "Password change failed",
            loading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, role: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        name: state.name,
        token: state.token,
        role: state.role,
      }),
    }
  )
);

export default useAuthStore;
