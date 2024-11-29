import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecipesList = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes`);
                setRecipes(response.data);
            } catch (error) {
                console.error('Błąd podczas pobierania przepisów:', error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div>
            <h1>Lista Przepisów</h1>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        <h2>{recipe.title}</h2>
                        <p>{recipe.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecipesList;
