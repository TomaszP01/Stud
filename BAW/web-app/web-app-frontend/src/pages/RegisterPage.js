import React from "react";
import Register from "../components/Register";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Register Page</h2>
      <Register />
      <button onClick={() => navigate("/")}>Go to Home</button>
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </div>
  );
};

export default RegisterPage;
