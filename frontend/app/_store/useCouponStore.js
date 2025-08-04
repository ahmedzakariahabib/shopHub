import { create } from "zustand";
import toast from "react-hot-toast";

const useCouponStore = create((set, get) => ({
  coupons: [],
  currentCoupon: null,
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

  fetchCoupons: async () => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");
      const response = await fetch("http://localhost:3000/api/v1/coupons", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `  ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch coupons");
      }

      set({
        coupons: data.coupon || [],
        loading: false,
      });
      return data.coupon;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchCoupon: async (id) => {
    set({ loading: true, error: null, currentCoupon: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");
      const response = await fetch(
        `http://localhost:3000/api/v1/coupons/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `  ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch coupon");
      }

      set({
        currentCoupon: data.coupon,
        loading: false,
      });
      return data.coupon;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  createCoupon: async (couponData) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");
      console.log(couponData);
      const response = await fetch("http://localhost:3000/api/v1/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `  ${token}`,
        },
        body: JSON.stringify(couponData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create coupon");
      }

      set((state) => ({
        coupons: [...state.coupons, data.coupon],
        loading: false,
      }));
      toast.success("Coupon created successfully");
      return data.coupon;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  updateCoupon: async (id, couponData) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/coupons/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `  ${token}`,
          },
          body: JSON.stringify(couponData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update coupon");
      }

      set((state) => ({
        coupons: state.coupons.map((coupon) =>
          coupon._id === id ? data.coupon : coupon
        ),
        currentCoupon: data.coupon,
        loading: false,
      }));
      toast.success("Coupon updated successfully");
      return data.coupon;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  deleteCoupon: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/coupons/${id}`,
        {
          method: "DELETE",
          headers: { token: ` ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete coupon");
      }

      set((state) => ({
        coupons: state.coupons.filter((coupon) => coupon._id !== id),
        currentCoupon:
          state.currentCoupon?._id === id ? null : state.currentCoupon,
        loading: false,
      }));
      toast.success("Coupon deleted successfully");
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

  clearCurrentCoupon: () => set({ currentCoupon: null }),
  clearError: () => set({ error: null }),
}));

export default useCouponStore;
