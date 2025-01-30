import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddRecipePage.css"; // Plik CSS dla stylizacji

const AddRecipePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const navigate = useNavigate();

  const handleAddRecipe = async () => {
    if (!title || !description || !ingredients || !steps) {
      alert("All fields must be filled out.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/recipes/add-recipe`,
        { title, description, ingredients, steps },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Recipe added successfully!");
      navigate(-1); // Powrót do poprzedniej strony
    } catch (error) {
      console.error("Error adding recipe:", error.response?.data || error.message);
      alert("Failed to add recipe.");
    }
  };

  return (
    <div className="add-recipe-container">
      <h2 className="page-title">Add Recipe</h2>
      <form className="add-recipe-form">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </label>
        <label>
          Ingredients:
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="textarea-field"
          />
        </label>
        <label>
          Steps:
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className="textarea-field"
          />
        </label>
        <div className="button-group">
          <button type="button" onClick={handleAddRecipe} className="btn-primary">
            Add
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipePage;
