// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/protected-route";
import Home from "./pages/admin/home";
import Login from "./pages/auth/login";
import HomeGuest from "./pages/guest/home";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={["admin", "guest"]}>
            <HomeGuest />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
