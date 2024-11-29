import React, { useState } from 'react';
import axios from 'axios';

const AddRecipe = () => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        author: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/recipes`, form);
            alert('Przepis został dodany!');
        } catch (error) {
            console.error('Błąd podczas dodawania przepisu:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Dodaj Przepis</h1>
            <input name="title" placeholder="Tytuł" onChange={handleChange} />
            <textarea name="description" placeholder="Opis" onChange={handleChange} />
            <textarea name="ingredients" placeholder="Składniki" onChange={handleChange} />
            <textarea name="steps" placeholder="Kroki" onChange={handleChange} />
            <input name="author" placeholder="Autor" onChange={handleChange} />
            <button type="submit">Dodaj</button>
        </form>
    );
};

export default AddRecipe;
