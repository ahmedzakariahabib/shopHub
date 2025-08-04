import { create } from "zustand";
import toast from "react-hot-toast";

const useCategoryStore = create((set, get) => ({
  categories: [],
  currentCategory: null,
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

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/api/v1/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      set({
        categories: data.categories || [],
        loading: false,
      });
      return data.categories;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchCategory: async (id) => {
    set({ loading: true, error: null, currentCategory: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/categories/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch category");
      }

      set({
        currentCategory: data.category,
        loading: false,
      });
      return data.category;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  createCategory: async (name, imageFile) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("img", imageFile);

      const response = await fetch("http://localhost:3000/api/v1/categories", {
        method: "POST",
        headers: { token: `  ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      set((state) => ({
        categories: [...state.categories, data.category],
        loading: false,
      }));
      toast.success("Category created successfully");
      return data.category;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  updateCategory: async (id, name, imageFile) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("img", imageFile);

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/${id}`,
        {
          method: "PUT",
          headers: { token: `  ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update category");
      }

      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? data.category : cat
        ),
        currentCategory: data.category,
        loading: false,
      }));
      toast.success("Category updated successfully");
      return data.category;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/categories/${id}`,
        {
          method: "DELETE",
          headers: { token: ` ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
        currentCategory:
          state.currentCategory?._id === id ? null : state.currentCategory,
        loading: false,
      }));
      toast.success("Category deleted successfully");
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

  clearCurrentCategory: () => set({ currentCategory: null }),
  clearError: () => set({ error: null }),
}));

export default useCategoryStore;
