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

      getAuthToken: () => {
        try {
          const authStorage = localStorage.getItem("auth-storage");
          if (!authStorage) return null;
          const parsed = JSON.parse(authStorage);
          return parsed?.state?.token || null;
        } catch (error) {
          console.error("Failed to get auth token:", error);
          return null;
        }
      },

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

      changePassword: async (passwords) => {
        set({ loading: true, error: null });

        try {
          const token = get().getAuthToken();
          if (!token) {
            throw new Error("Authentication required. Please login.");
          }
          const { oldPassword, newPassword } = passwords;
          const payload = {
            password: String(oldPassword || ""),
            newPassword: String(newPassword || ""),
          };
          const response = await fetch(
            "http://localhost:3000/api/v1/auth/changePassword",
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                token: `${token}`,
              },
              body: JSON.stringify(payload),
            }
          );
          const data = await response.json();
          console.log(data);
          if (!response.ok || data.message === "incorret email or password") {
            throw new Error(data.message || "Password change failed");
          }
          set({ loading: false, error: null });
          toast.success("Password updated successfully");

          return { success: true, data };
        } catch (error) {
          toast.error(error.message);
          set({
            error: error.message || "Password change failed",
            loading: false,
          });
          return { success: false, error: error.message };
        }
      },
      logout: () => {
        set({
          name: null,
          token: null,
          role: null,
          error: null,
          loading: false,
        });
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
