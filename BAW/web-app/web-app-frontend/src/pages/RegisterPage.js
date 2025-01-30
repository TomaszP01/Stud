import React from "react";
import Register from "../components/Register";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css"; // Plik CSS dla stylizacji

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="register-page-container">
      <h2 className="page-title">Register Page</h2>
      <div className="register-form-container">
        <Register />
      </div>
      <div className="button-group">
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Go to Home
        </button>
        <button className="btn-primary" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
