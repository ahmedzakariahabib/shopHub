import { create } from "zustand";
import toast from "react-hot-toast";

const useWishlistStore = create((set, get) => ({
  wishlistItems: [],
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

  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");
      const response = await fetch("http://localhost:3000/api/v1/wishlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch wishlist");
      }

      set({
        wishlistItems: data.wishlist || [],
        loading: false,
      });
      return data.wishlist;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  updateWishlist: async (productId) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch("http://localhost:3000/api/v1/wishlist", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
        body: JSON.stringify({ product: productId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update wishlist");
      }

      set({
        wishlistItems: data.wishlist || [],
        loading: false,
      });
      toast.success("Wishlist updated successfully");
      return data.wishlist;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  deleteFromWishlist: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");
      const response = await fetch(
        `http://localhost:3000/api/v1/wishlist/${id}`,
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
        throw new Error(data.message || "Failed to remove from wishlist");
      }

      set((state) => ({
        wishlistItems: state.wishlistItems.filter((item) => item._id !== id),
        loading: false,
      }));
      toast.success("Item removed from wishlist");
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

  clearError: () => set({ error: null }),
}));

export default useWishlistStore;
