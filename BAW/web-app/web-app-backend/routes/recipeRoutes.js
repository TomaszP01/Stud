const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require('../config/db'); // Zakładamy, że masz konfigurację połączenia z bazą danych

// Pobierz przepisy uzytkownika
router.get("/my-recipes", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Informacja z tokena
        const [recipes] = await db.promise().query(
            "SELECT * FROM recipes WHERE author_id = ? ORDER BY created_at DESC;",
            [userId]
        );
        if (recipes.length === 0) {
            return res.status(404).json({ message: "/my-recipes Recipe not found" });
        }
        res.json(recipes); // Zwróć przepisy użytkownika
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch recipes" });
    }
  });

// Dodaj przepis
router.post("/add-recipe", authMiddleware, async (req, res) => {
    const connection = await db.promise().getConnection(); // Pobierz połączenie do transakcji
    try {
      const { title, description, ingredients, steps } = req.body;
      const userId = req.user.id;
  
      if (!title || !description || !ingredients || !steps) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      await connection.beginTransaction(); // Rozpocznij transakcję
  
      // Wstawienie przepisu
      const [result] = await connection.query(
        "INSERT INTO recipes (title, description, ingredients, steps, author_id) VALUES (?, ?, ?, ?, ?)",
        [title, description, ingredients, steps, userId]
      );
  
      const recipeId = result.insertId;
  
      // Dodanie sekcji komentarzy dla przepisu
      await connection.query(
        "INSERT INTO comment_sections (recipe_id) VALUES (?)",
        [recipeId]
      );
  
      await connection.commit(); // Zatwierdź transakcję
      res.status(201).json({ id: recipeId, message: "Recipe added successfully!" });
  
    } catch (error) {
      await connection.rollback(); // Wycofaj transakcję w przypadku błędu
      res.status(500).json({ message: error.message || "Failed to add recipe." });
    } finally {
      connection.release(); // Zawsze zwalniaj połączenie
    }
});
  
// Pobierz wszystkie przepisy (tylko tytuł i opis)
router.get("/latest-recipes", async (req, res) => {
    try {
      const [rows] = await db.promise().query("SELECT id, title, description FROM recipes ORDER BY created_at DESC");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Pobierz szczegóły przepisu i komentarze
router.get("/recipe/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [recipe] = await db.promise().query(
      "SELECT * FROM recipes WHERE id = ?",
      [id]
    );

    if (recipe.length === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const [comments] = await db.promise().query(
      `SELECT c.id, c.content, c.created_at, u.id 
       FROM comments c 
       INNER JOIN users u ON c.user_id = u.id 
       WHERE c.id = ? 
       ORDER BY c.created_at DESC`,
      [id]
    );

    res.json({
      recipe: recipe[0], // Szczegóły przepisu
      comments,          // Lista komentarzy
    });
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    res.status(500).json({ message: "Failed to fetch recipe details." });
  }
});

router.delete("/delete-recipe/:id", authMiddleware, async (req, res) => {
  const { id } = req.params; // ID przepisu
  const userId = req.user.id; // ID użytkownika z middleware

  try {
    // Sprawdź, czy przepis istnieje i należy do użytkownika
    const [recipe] = await db.promise().query(
      "SELECT * FROM recipes WHERE id = ? AND author_id = ?",
      [id, userId]
    );

    if (recipe.length === 0) {
      return res.status(404).json({ message: "Recipe not found or not authorized to delete." });
    }

    // Usuń powiązane dane (np. komentarze, sekcje)
    await db.promise().query("DELETE FROM comment_sections WHERE recipe_id = ?", [id]);
    await db.promise().query("DELETE FROM recipes WHERE id = ?", [id]);

    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Failed to delete recipe.1" });
  }
});


module.exports = router;
