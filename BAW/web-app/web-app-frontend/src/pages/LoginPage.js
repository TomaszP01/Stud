import React from "react";
import Login from "../components/Login";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Login Page</h2>
      <Login
        onLoginSuccess={(token) => {
          console.log("Logged in with token:", token);
          navigate("/"); // Przeniesienie użytkownika na HomePage
        }}
      />
      <button onClick={() => navigate("/")}>Go to Home</button>
      <button onClick={() => navigate("/register")}>Go to Register</button>
    </div>
  );
};


export default LoginPage;
