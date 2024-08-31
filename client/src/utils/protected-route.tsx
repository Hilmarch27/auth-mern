// ProtectedRoute.tsx
import { useAuthStore } from "@/zustand/auth-store";
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, userRole } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect berdasarkan role jika sudah login
    if (isAuthenticated) {
      if (userRole === "admin" && !allowedRoles.includes(userRole)) {
        navigate("/dashboard");
      } else if (userRole === "guest" && !allowedRoles.includes(userRole)) {
        navigate("/home");
      }
    }
  }, [isAuthenticated, userRole, allowedRoles, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
