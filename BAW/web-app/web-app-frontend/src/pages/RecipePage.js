import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RecipePage = () => {
  const { id } = useParams(); // Pobierz id przepisu z URL
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const token = localStorage.getItem("token"); // Pobierz token z localStorage
      if (!token) {
        setError("You must be logged in to view this recipe.");
        navigate("/login"); // Przekieruj użytkownika na stronę logowania
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/recipes/recipe/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Dołącz token do nagłówków
            },
          }
        );
        setRecipe(response.data.recipe);
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching recipe details:", error.response?.data || error.message);
        setError("Failed to load recipe details.");
      }
    };

    fetchRecipeDetails();
  }, [id, navigate]);

  if (error) {
    return <div><p>{error}</p></div>;
  }

  if (!recipe) {
    return <div><p>Loading...</p></div>;
  }

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <h3>Ingredients:</h3>
      <p>{recipe.ingredients}</p>
      <h3>Steps:</h3>
      <p>{recipe.steps}</p>

      <h3>Comments:</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p><strong>{comment.username}</strong>: {comment.content}</p>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default RecipePage;
