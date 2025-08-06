"use client";

import { Authorization } from "./authorization";

export function ProtectedComponent() {
  const { isAdmin, isUser } = Authorization();

  let role = null;

  if (isAdmin) {
    role = "admin";
  }
  if (isUser) {
    role = "user";
  }

  return role;
}
