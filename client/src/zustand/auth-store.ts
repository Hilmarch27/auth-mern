// auth-store.ts
import { create } from "zustand";

type Role = "admin" | "user" | "guest"; // Tambahkan role sesuai kebutuhan

interface AuthState {
  isAuthenticated: boolean;
  userRole: Role;
  setAuth: (isAuthenticated: boolean, userRole: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRole: "guest",
  setAuth: (isAuthenticated, userRole) => set({ isAuthenticated, userRole }),
  logout: () => set({ isAuthenticated: false, userRole: "guest" }),
}));
