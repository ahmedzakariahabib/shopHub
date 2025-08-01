"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

const useSubcategoryStore = create((set, get) => ({
  subcategories: [],
  currentSubcategory: null,
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

  fetchSubcategories: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/categories/${categoryId}/subcategories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subcategories");
      }

      set({
        subcategories: data.subcategories || [],
        loading: false,
      });
      return data.subcategories;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchSubcategory: async (subcategoryId) => {
    set({ loading: true, error: null, currentSubcategory: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/subcategories/${subcategoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subcategory");
      }

      set({
        currentSubcategory: data.subcategory,
        loading: false,
      });
      return data.subcategory;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  createSubcategory: async (categoryId, name) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/subcategories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: `  ${token.trim()}`,
          },
          body: JSON.stringify({
            name: name,
            category: categoryId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create subcategory");
      }

      set((state) => ({
        subcategories: [...state.subcategories, data.subcategory],
        loading: false,
      }));

      return data.subcategory;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  updateSubcategory: async (subcategoryId, name) => {
    set({ loading: true, error: null });
    try {
      console.log("df", subcategoryId, name);
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/subcategories/${subcategoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          body: JSON.stringify({
            name: name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update subcategory");
      }

      set((state) => ({
        subcategories: state.subcategories.map((subcat) =>
          subcat._id === subcategoryId ? data.subcategory : subcat
        ),
        currentSubcategory: data.subcategory,
        loading: false,
      }));

      return data.subcategory;
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
      throw error; // Re-throw to handle in component
    }
  },

  deleteSubcategory: async (categoryId, subcategoryId) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/subcategories/${subcategoryId}`,
        {
          method: "DELETE",
          headers: { token: ` ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete subcategory");
      }

      set((state) => ({
        subcategories: state.subcategories.filter(
          (subcat) => subcat._id !== subcategoryId
        ),
        currentSubcategory:
          state.currentSubcategory?._id === subcategoryId
            ? null
            : state.currentSubcategory,
        loading: false,
      }));
      toast.success("Subcategory deleted successfully");
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

  clearCurrentSubcategory: () => set({ currentSubcategory: null }),
  clearError: () => set({ error: null }),
}));

export default useSubcategoryStore;
