import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RecipePage.css"; // Plik CSS dla stylizacji

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  // Pobieranie danych przepisu i komentarzy
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view this recipe.");
        navigate("/login");
        return;
      }

      try {
        // Pobierz szczegóły przepisu
        const recipeResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/recipes/recipe/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecipe(recipeResponse.data.recipe);

        // Pobierz komentarze
        const commentsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/comments/${id}`
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching recipe details:", error.response?.data || error.message);
        setError("Failed to load recipe details.");
      }
    };

    fetchRecipeDetails();
  }, [id, navigate]);

  // Obsługa dodawania komentarzy
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comments`,
        { recipe_id: id, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment(""); // Wyczyść pole tekstowe

      // Pobierz zaktualizowaną listę komentarzy
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${id}`);
      setComments(response.data);
    } catch (err) {
      console.error("Nie udało się dodać komentarza:", err.response?.data || err.message);
      setError("Nie udało się dodać komentarza.");
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="recipe-page-container">
      <h1 className="recipe-title">{recipe.title}</h1>
      <p className="recipe-description">{recipe.description}</p>
      
      <div className="recipe-section">
        <h3>Ingredients:</h3>
        <p>{recipe.ingredients}</p>
      </div>

      <div className="recipe-section">
        <h3>Steps:</h3>
        <p>{recipe.steps}</p>
      </div>

      <div className="comments-section">
        <h3>Comments:</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <p>
                  <strong>{comment.username}</strong>: {comment.content}
                </p>
                <small>{new Date(comment.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Dodaj komentarz..."
          ></textarea>
          <button onClick={handleAddComment}>Dodaj</button>
        </div>
      </div>

      <button className="btn-back" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default RecipePage;
