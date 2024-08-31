// Login.tsx
import React, { useState } from "react";
import { login } from "@/service/auth-service";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand/auth-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleLogin}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Sign in</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Login;
