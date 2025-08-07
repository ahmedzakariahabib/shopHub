"use client";

import { useEffect, useState } from "react";
import useAuthStore from "../_store/authStore";
import ProductsList from "../_components/products";
import AdminDashboard from "../_components/AdminDashboard";
import UserDashboard from "../_components/userDashboard";
import BrandsList from "../_components/brands";
import CategoriesPage from "../_components/categories";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isUser, setIsUser] = useState(null);
  const { role: stateRole } = useAuthStore();

  const getRoleFromToken = () => {
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) return null;
      const { token } = JSON.parse(authStorage)?.state || {};
      if (!token) return null;

      const decoded = jwtDecode(token);

      return decoded?.role || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const role = getRoleFromToken();
    const isUserAdmin = role === "admin" && stateRole === "admin";
    const checkUserRole = role === "user" && stateRole === "user";
    setIsAdmin(isUserAdmin);
    setIsUser(checkUserRole);
  }, [stateRole]);

  return (
    <div>
      {isAdmin && <AdminDashboard />}
      {isUser && <UserDashboard />}
      <ProductsList />
      <CategoriesPage />
      <BrandsList />
    </div>
  );
}
