import { create } from "zustand";
import toast from "react-hot-toast";

const useUserStore = create((set, get) => ({
  users: [],
  currentUser: null,
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

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      set({
        users: data.users || [],
        loading: false,
      });
      return data.users;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchUser: async (id) => {
    set({ loading: true, error: null, currentUser: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }

      set({
        currentUser: data.user,
        loading: false,
      });
      return data.user;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          rePassword: userData.rePassword,
          role: userData.role,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to create user");
      }

      set((state) => ({
        users: [...state.users, data.user],
        loading: false,
      }));
      toast.success("User created successfully");
      return data.user;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      // Build the update object, only including fields that have values
      const updateData = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      // Only add password fields if they exist
      if (userData.password) {
        updateData.password = userData.password;
      }
      if (userData.rePassword) {
        updateData.rePassword = userData.rePassword;
      }

      const response = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update user");
      }

      set((state) => ({
        users: state.users.map((user) => (user._id === id ? data.user : user)),
        currentUser:
          state.currentUser?._id === id ? data.user : state.currentUser,
        loading: false,
      }));
      toast.success("User updated successfully");
      return data.user;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
        method: "DELETE",
        headers: { token: `${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      set((state) => ({
        users: state.users.filter((user) => user._id !== id),
        currentUser: state.currentUser?._id === id ? null : state.currentUser,
        loading: false,
      }));
      toast.success("User deleted successfully");
      return true;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return false;
    }
  },

  changeUserPassword: async (id, passwordData) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${id}/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          body: JSON.stringify(passwordData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      set({ loading: false });
      toast.success("Password changed successfully");
      return data;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  clearCurrentUser: () => set({ currentUser: null }),
  clearError: () => set({ error: null }),
  clearUsers: () => set({ users: [] }),
}));

export default useUserStore;
