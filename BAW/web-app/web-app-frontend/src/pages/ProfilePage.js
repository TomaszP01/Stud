import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css"; // Plik CSS dla stylizacji

const ProfilePage = ({ setIsAuthenticated }) => {
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [view, setView] = useState("recipes"); // "recipes" lub "comments"
  const navigate = useNavigate();

  useEffect(() => {
    if (view === "recipes") {
      fetchRecipes();
    } else {
      fetchComments();
    }
  }, [view]); // Zmiana widoku powoduje pobranie odpowiednich danych

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/recipes/my-recipes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecipes(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch recipes.");
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/comments/my-comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch comments.");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/recipes/delete-recipe/${recipeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
      setMessage("Recipe deleted successfully.");
    } catch (error) {
      setMessage("Failed to delete recipe.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/comments/delete-comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setMessage("Comment deleted successfully.");
    } catch (error) {
      setMessage("Failed to delete comment.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="profile-page-container">
      <h2 className="page-title">My Profile</h2>
      <div className="button-group">
        <button className="btn-secondary" onClick={handleLogout}>
          Logout
        </button>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Go to Home
        </button>
        <button className="btn-primary" onClick={() => navigate("/add-recipe")}>
          Add Recipe
        </button>
        <button
          className="btn-toggle"
          onClick={() => setView(view === "recipes" ? "comments" : "recipes")}
        >
          {view === "recipes" ? "Show My Comments" : "Show My Recipes"}
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      {view === "recipes" ? (
        <div className="recipes-section">
          <h3>My Recipes</h3>
          {recipes.length === 0 ? (
            <p>No recipes found.</p>
          ) : (
            <ul className="recipe-list">
              {recipes.map((recipe) => (
                <li key={recipe.id} className="recipe-item">
                  <span>{recipe.title}</span>
                  <div className="recipe-actions">
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                    >
                      View
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="comments-section">
          <h3>My Comments</h3>
          {comments.length === 0 ? (
            <p>No comments found.</p>
          ) : (
            <ul className="comment-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  <p>{comment.content}</p>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
