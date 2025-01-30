import React from "react";
import Login from "../components/Login";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Plik CSS dla stylizacji

const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <div className="login-page-container">
      <h2 className="page-title">Login Page</h2>
      <div className="login-form-container">
        <Login
          onLoginSuccess={(token) => {
            setIsAuthenticated(true); // Aktualizacja stanu globalnego
            navigate("/profile"); // Przekierowanie użytkownika
          }}
        />
      </div>
      <div className="button-group">
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Go to Home
        </button>
        <button className="btn-primary" onClick={() => navigate("/register")}>
          Go to Register
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
