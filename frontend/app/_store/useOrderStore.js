"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
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

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch("http://localhost:3000/api/v1/orders/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      set({
        orders: data.orders || [],
        loading: false,
      });
      return data.orders;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  fetchOrder: async () => {
    set({ loading: true, error: null, currentOrder: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(`http://localhost:3000/api/v1/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch order");
      }

      set({
        currentOrder: data.order,
        loading: false,
      });
      console.log(data.order);
      return data.order;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  createOrder: async (orderData, id) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");
      console.log(orderData.shippingAddress);
      const response = await fetch(
        `http://localhost:3000/api/v1/orders/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          body: JSON.stringify({ shippingAddress: orderData.shippingAddress }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      set((state) => ({
        orders: [...state.orders, data.order],
        loading: false,
      }));
      toast.success("Order created successfully");
      return data.order;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  checkoutOrder: async (id, checkoutData) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/orders/${id}/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          body: JSON.stringify(checkoutData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to checkout order");
      }

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? data.order : order
        ),
        currentOrder: data.order,
        loading: false,
      }));
      toast.success("Order checkout successful");
      return data.order;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null }),
  clearError: () => set({ error: null }),
}));

export default useOrderStore;
