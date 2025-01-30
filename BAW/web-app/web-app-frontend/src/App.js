import axios from "axios";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AddRecipePage from "./pages/AddRecipePage";
import ProtectedRoute from "./components/ProtectedRoute";
import RecipePage from "./pages/RecipePage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/verify-token", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        console.error("Token verification failed:", error.response?.data?.message);
      }
    };

    verifyToken();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" /> : <RegisterPage />} />
        {/* Ochronione trasy */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/profile" element={<ProfilePage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/add-recipe" element={<AddRecipePage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
