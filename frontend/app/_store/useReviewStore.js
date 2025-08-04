"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

const useReviewStore = create((set, get) => ({
  reviews: [],
  currentReview: null,
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

  fetchReviews: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/api/v1/reviews", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }

      set({
        reviews: data.reviews || [],
        loading: false,
      });
      return data.reviews;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchReview: async (id) => {
    set({ loading: true, error: null, currentReview: null });
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/reviews/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch review");
      }

      set({
        currentReview: data.review,
        loading: false,
      });
      return data.review;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  createReview: async ({ product, rate, text }) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");
      console.log(product, rate, text);
      const response = await fetch("http://localhost:3000/api/v1/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
        body: JSON.stringify({
          product,
          rate,
          text,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create review");
      }

      set((state) => ({
        reviews: [...state.reviews, data.review],
        loading: false,
      }));

      return data.review;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  updateReview: async (id, { rate, text }) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/reviews/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `  ${token}`,
          },
          body: JSON.stringify({
            rate,
            text,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update review");
      }

      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === id ? data.review : review
        ),
        currentReview: data.review,
        loading: false,
      }));
      toast.success("Review updated successfully");
      return data.review;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  deleteReview: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");
      console.log(id);
      const response = await fetch(
        `http://localhost:3000/api/v1/reviews/${id}`,
        {
          method: "DELETE",
          headers: { token: ` ${token}` },
        }
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      set((state) => ({
        reviews: state.reviews.filter((review) => review._id !== id),
        currentReview:
          state.currentReview?._id === id ? null : state.currentReview,
        loading: false,
      }));
      toast.success("Review deleted successfully");
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

  clearCurrentReview: () => set({ currentReview: null }),
  clearError: () => set({ error: null }),
}));

export default useReviewStore;
