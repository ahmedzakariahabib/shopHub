"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "../_store/authStore";

export function Authorization() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isUser, setIsUser] = useState(null);
  const [role, setRole] = useState(null);

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
    const tokenRole = getRoleFromToken();
    const isUserAdmin = tokenRole === "admin" && stateRole === "admin";
    const checkUserRole = tokenRole === "user" && stateRole === "user";

    setIsAdmin(isUserAdmin);
    setIsUser(checkUserRole);

    if (isUserAdmin) {
      setRole("admin");
    } else if (checkUserRole) {
      setRole("user");
    } else {
      setRole(null);
    }
  }, [stateRole]);

  return { isAdmin, isUser };
}
