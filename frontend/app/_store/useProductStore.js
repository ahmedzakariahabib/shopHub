"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
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

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/api/v1/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      set({
        products: data.products || [],
        loading: false,
      });
      return data.products;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true, error: null, currentProduct: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/products/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch product");
      }

      set({
        currentProduct: data.product,
        loading: false,
      });
      console.log(data.product);
      return data.product;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  createProduct: async (productData, images, imgCover) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const formData = new FormData();

      // Append required product fields
      const {
        title,
        description,
        price,
        brand,
        subcategory,
        category,
        priceAfterDiscount,
      } = productData;

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("brand", brand);
      formData.append("subcategory", subcategory);
      formData.append("category", category);

      if (priceAfterDiscount !== null && priceAfterDiscount !== undefined) {
        formData.append("priceAfterDiscount", priceAfterDiscount);
      }

      // Append cover image
      if (imgCover) {
        formData.append("imgCover", imgCover);
      }

      // Append multiple images
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await fetch("http://localhost:3000/api/v1/products", {
        method: "POST",
        headers: { token: `  ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      set((state) => ({
        products: [...state.products, data.product],
        loading: false,
      }));
      toast.success("Product created successfully");
      return data.product;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  updateProduct: async (id, productData, images, imgCover) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const formData = new FormData();

      // Append product fields that are provided
      const {
        title,
        description,
        price,
        brand,
        subcategory,
        category,
        priceAfterDiscount,
      } = productData;

      if (title) formData.append("title", title);
      if (description) formData.append("description", description);
      if (price !== null && price !== undefined)
        formData.append("price", price);
      if (brand) formData.append("brand", brand);
      if (subcategory) formData.append("subcategory", subcategory);
      if (category) formData.append("category", category);
      if (priceAfterDiscount !== null && priceAfterDiscount !== undefined) {
        formData.append("priceAfterDiscount", priceAfterDiscount);
      }

      // Append cover image if provided
      if (imgCover) {
        formData.append("imgCover", imgCover);
      }

      // Append multiple images if provided
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await fetch(
        `http://localhost:3000/api/v1/products/${id}`,
        {
          method: "PUT",
          headers: { token: `  ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? data.product : product
        ),
        currentProduct: data.product,
        loading: false,
      }));
      toast.success("Product updated successfully");
      return data.product;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/products/${id}`,
        {
          method: "DELETE",
          headers: { token: ` ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        currentProduct:
          state.currentProduct?._id === id ? null : state.currentProduct,
        loading: false,
      }));
      toast.success("Product deleted successfully");
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

  // Additional product-specific methods
  fetchProductsByCategory: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/products?categoryId=${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products by category");
      }

      set({
        products: data.products || [],
        loading: false,
      });
      return data.products;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  searchProducts: async (searchTerm) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/products/search?q=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to search products");
      }

      set({
        products: data.products || [],
        loading: false,
      });
      return data.products;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  updateProductStock: async (id, stock) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/products/${id}/stock`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            token: ` ${token}`,
          },
          body: JSON.stringify({ stock }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update product stock");
      }

      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? { ...product, stock: data.stock } : product
        ),
        currentProduct:
          state.currentProduct?._id === id
            ? { ...state.currentProduct, stock: data.stock }
            : state.currentProduct,
        loading: false,
      }));
      toast.success("Product stock updated successfully");
      return data.stock;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null }),
  clearError: () => set({ error: null }),
}));

export default useProductStore;
