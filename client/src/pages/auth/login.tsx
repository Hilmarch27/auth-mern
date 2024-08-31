// Login.tsx
import React, { useState } from "react";
import { login } from "@/service/auth-service";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand/auth-store";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook untuk navigasi
  const { userRole } = useAuthStore(); // Ambil user role dari Zustand
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });

      // Jika login berhasil, lakukan redirect ke /dashboard
      // Redirect berdasarkan role
      if (userRole === "admin") {
        navigate("/dashboard");
      } else if (userRole === "guest") {
        navigate("/home");
      } else {
        navigate("/"); // Default redirect jika role tidak sesuai
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
