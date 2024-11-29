import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
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
    <div>
      <h1>Welcome to the Recipe Sharing Platform</h1>

      {isAuthenticated ? (
        <>
          <p>You are logged in! Enjoy exploring recipes.</p>
          <button onClick={() => navigate("/profile")}>My Profile</button>
          <button onClick={() => navigate("/add-recipe")}>Add Recipe</button>
        </>
      ) : (
        <p>Explore recipes, login or register to get started!</p>
      )}

      <div>
        {!isAuthenticated && (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </>
        )}
      </div>

      <h2>Latest Recipes</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <ul>
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          <Link to={`/recipe/${recipe.id}`}>View Details</Link> {/* Link do szczegółów */}
        </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
