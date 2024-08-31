// auth-service.ts
import api from "../utils/axios-api";
import { useAuthStore } from "../zustand/auth-store";

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    await api.post("/auth/login", credentials); // Proses login
    await fetchUserRole(); // Ambil data user setelah login
  } catch (error) {
    console.error("Login failed:", error);
  }
};

export const fetchUserRole = async () => {
  try {
    const response = await api.get("/user/current"); // Panggil endpoint untuk mendapatkan data user
    const { role } = response.data.data; // Akses field 'role' dari 'data'
    console.log('role:', role)

    // Set state di Zustand
    useAuthStore.getState().setAuth(true, role);
  } catch (error) {
    console.error("Failed to fetch user role:", error);
    useAuthStore.getState().logout(); // Logout jika gagal mendapatkan data user
  }
};
