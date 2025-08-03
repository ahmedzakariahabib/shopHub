"use client";

import { create } from "zustand";
import toast from "react-hot-toast";

const useCartStore = create((set, get) => ({
  cartItems: [],
  cartSummary: {
    totalCartPrice: 0,
    totalPriceAfterDiscount: 0,
    numOfCartItems: 0,
  },
  loading: false,
  error: null,
  appliedCoupon: null,

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

  // Get logged user cart
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch("http://localhost:3000/api/v1/carts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cart");
      }

      set({
        cartItems: data?.cart.cartItems || [],
        cartSummary: {
          totalCartPrice: data.cart?.totalPrice || 0,
          totalPriceAfterDiscount: data.cart?.totalPriceAfterDiscount || 0,
          numOfCartItems: data.numOfCartItems || 0,
        },
        loading: false,
      });
      console.log(data.cart);
      return data.cart;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  // Add product to cart
  addToCart: async (productId) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch("http://localhost:3000/api/v1/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
        body: JSON.stringify({ product: productId, quantity: 1 }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add product to cart");
      }

      set({
        cartItems: data.cart?.cartItems || [],
        cartSummary: {
          totalCartPrice: data.cart?.totalPrice || 0,
          totalPriceAfterDiscount: data.cart?.totalPriceAfterDiscount || 0,
          numOfCartItems: data.numOfCartItems || 0,
        },
        loading: false,
      });
      toast.success("Product added to cart successfully");
      return data.data;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  // Remove specific cart item
  removeFromCart: async (itemId) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/carts/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to remove item from cart");
      }

      set({
        cartItems: data.cart?.cartItems || [],
        cartSummary: {
          totalCartPrice: data.cart?.totalPrice || 0,
          totalPriceAfterDiscount: data.cart?.totalPriceAfterDiscount || 0,
          numOfCartItems: data.numOfCartItems || 0,
        },
        loading: false,
      });
      toast.success("Item removed from cart");
      return data.data;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  // Update cart product quantity
  updateCartItemQuantity: async (itemId, quantity) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/carts/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update cart item quantity");
      }

      set({
        cartItems: data.cart?.cartItems || [],
        cartSummary: {
          totalCartPrice: data.cart?.totalPrice || 0,
          totalPriceAfterDiscount: data.cart?.totalPriceAfterDiscount || 0,
          numOfCartItems: data.numOfCartItems || 0,
        },
        loading: false,
      });
      toast.success("Cart updated successfully");
      return data.data;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  // Clear user cart
  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch("http://localhost:3000/api/v1/carts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to clear cart");
      }

      set({
        cartItems: [],
        cartSummary: {
          totalCartPrice: 0,
          totalPriceAfterDiscount: 0,
          numOfCartItems: 0,
        },
        appliedCoupon: null,
        loading: false,
      });
      toast.success("Cart cleared successfully");
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

  // Apply coupon to cart
  applyCoupon: async (couponName) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        "http://localhost:3000/api/v1/cart/applyCoupon",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
          body: JSON.stringify({ coupon: couponName }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to apply coupon");
      }

      set({
        cartItems: data.data?.cartItems || get().cartItems,
        cartSummary: {
          totalCartPrice: data.data?.totalCartPrice || 0,
          totalPriceAfterDiscount: data.data?.totalPriceAfterDiscount || 0,
          numOfCartItems: data.numOfCartItems || 0,
        },
        appliedCoupon: couponName,
        loading: false,
      });
      toast.success("Coupon applied successfully");
      return data.data;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  // Helper functions
  getCartItemsCount: () => {
    const state = get();
    return state.cartSummary.numOfCartItems;
  },

  getCartTotal: () => {
    const state = get();
    return (
      state.cartSummary.totalPriceAfterDiscount ||
      state.cartSummary.totalCartPrice
    );
  },

  isInCart: (productId) => {
    const state = get();
    return state.cartItems.some((item) => item.product?._id === productId);
  },

  clearError: () => set({ error: null }),
}));

export default useCartStore;
