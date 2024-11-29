import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [view, setView] = useState("recipes");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (view === "recipes") {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes/my-recipes`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRecipes(response.data);
        } else if (view === "comments") {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/my-comments`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setComments(response.data);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to fetch data.");
      }
    };

    fetchData();
  }, [view]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      <h2>My Profile</h2>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate("/")}>Go to Home</button>
      <button onClick={() => navigate("/add-recipe")}>Add Recipe</button>
      {message && <p>{message}</p>}

      <div>
        <button onClick={() => setView("recipes")}>My Recipes</button>
        <button onClick={() => setView("comments")}>My Comments</button>
      </div>

      {view === "recipes" && (
        <div>
          <h3>My Recipes</h3>
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>{recipe.title}</li>
            ))}
          </ul>
        </div>
      )}

      {view === "comments" && (
        <div>
          <h3>My Comments</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                {comment.content} (Recipe ID: {comment.recipe_id})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
