import { create } from "zustand";
import toast from "react-hot-toast";

const useAddressStore = create((set, get) => ({
  addresses: [],
  currentAddress: null,
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

  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch("http://localhost:3000/api/v1/addresses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch addresses");
      }

      set({
        addresses: data.addresses || [],
        loading: false,
      });
      return data.addresses;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  addAddress: async (addressData) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch("http://localhost:3000/api/v1/addresses", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add address");
      }

      set((state) => ({
        addresses: [...state.addresses, data.address],
        loading: false,
      }));
      toast.success("Address added successfully");
      return data.address;
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        loading: false,
      });
      return null;
    }
  },

  deleteAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = get().getAuthToken();
      if (!token) throw new Error("Authentication required. Please login.");

      const response = await fetch(
        `http://localhost:3000/api/v1/addresses/${id}`,
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
        throw new Error(data.message || "Failed to delete address");
      }

      set((state) => ({
        addresses: state.addresses.filter((addr) => addr._id !== id),
        currentAddress:
          state.currentAddress?._id === id ? null : state.currentAddress,
        loading: false,
      }));
      toast.success("Address deleted successfully");
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

  clearCurrentAddress: () => set({ currentAddress: null }),
  clearError: () => set({ error: null }),
  clearAddresses: () => set({ addresses: [], currentAddress: null }),
}));

export default useAddressStore;
