"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

const useBrandStore = create((set, get) => ({
  brands: [],
  currentBrand: null,
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

  fetchBrands: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/api/v1/brands", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch brands");
      }

      set({
        brands: data.Brands || [],
        loading: false,
      });
      return data.Brands;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchBrand: async (id) => {
    set({ loading: true, error: null, currentBrand: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/brands/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch brand");
      }

      set({
        currentBrand: data.brand,
        loading: false,
      });

      return data.brand;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  createBrand: async (name, imageFile) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("logo", imageFile);

      const response = await fetch("http://localhost:3000/api/v1/brands", {
        method: "POST",
        headers: { token: `  ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create brand");
      }

      set((state) => ({
        brands: [...state.brands, data.brand],
        loading: false,
      }));
      toast.success("Brand created successfully");
      return data.brand;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  updateBrand: async (id, name, imageFile) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) formData.append("logo", imageFile);

      const response = await fetch(
        `http://localhost:3000/api/v1/brands/${id}`,
        {
          method: "PUT",
          headers: { token: `  ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update brand");
      }

      set((state) => ({
        brands: state.brands.map((brand) =>
          brand._id === id ? data.brand : brand
        ),
        currentBrand: data.brand,
        loading: false,
      }));
      toast.success("Brand updated successfully");
      return data.brand;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  deleteBrand: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/brands/${id}`,
        {
          method: "DELETE",
          headers: { token: ` ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete brand");
      }

      set((state) => ({
        brands: state.brands.filter((brand) => brand._id !== id),
        currentBrand:
          state.currentBrand?._id === id ? null : state.currentBrand,
        loading: false,
      }));
      toast.success("Brand deleted successfully");
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

  clearCurrentBrand: () => set({ currentBrand: null }),
  clearError: () => set({ error: null }),
}));

export default useBrandStore;
