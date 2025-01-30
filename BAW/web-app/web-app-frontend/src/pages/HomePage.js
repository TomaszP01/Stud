import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css"; // Dodaj plik CSS

const HomePage = ({ isAuthenticated }) => {
  const [recipes, setRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Token in localStorage:", localStorage.getItem("token"));
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes/latest-recipes`);
        setRecipes(response.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recipes:", error.response?.data || error.message);
        setErrorMessage("Failed to load recipes.");
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to the Recipe Sharing Platform</h1>

      {isAuthenticated ? (
        <div className="auth-section">
          <p>You are logged in! Enjoy exploring recipes.</p>
          <button className="btn-primary" onClick={() => navigate("/profile")}>My Profile</button>
          <button className="btn-primary" onClick={() => navigate("/add-recipe")}>Add Recipe</button>
        </div>
      ) : (
        <p className="info-text">Explore recipes, login or register to get started!</p>
      )}

      {!isAuthenticated && (
        <div className="auth-buttons">
          <Link to="/login">
            <button className="btn-secondary">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn-secondary">Register</button>
          </Link>
        </div>
      )}

      <h2 className="section-title">Latest Recipes</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="recipe-card">
            <h3 className="recipe-title">{recipe.title}</h3>
            <p className="recipe-description">{recipe.description}</p>
            <Link to={`/recipe/${recipe.id}`} className="view-details-link">View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
