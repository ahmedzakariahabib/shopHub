// components/LogoutButton.jsx
"use client";
import { useAuthStore } from "@/stores/authStore";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <button onClick={logout} className="text-red-500">
      Logout
    </button>
  );
}
