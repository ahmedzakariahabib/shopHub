"use client";

import useAuthStore from "../_store/authStore";
function getRole() {
  const { role } = useAuthStore();
  return role;
}

export default getRole;
