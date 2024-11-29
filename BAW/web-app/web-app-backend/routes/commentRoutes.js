const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db"); // Konfiguracja połączenia z bazą danych

// Pobierz komentarze użytkownika
router.get("/my-comments", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Informacja z tokena
    const [comments] = await db.promise().query(
      "SELECT * FROM comments WHERE user_id = ? ORDER BY created_at DESC;",
      [userId]
    );
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found." });
    }
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch comments." });
  }
});

// Dodaj nowy komentarz (opcjonalnie, dla innych funkcjonalności)
router.post("/add-comment", authMiddleware, async (req, res) => {
  try {
    const { recipeId, content } = req.body;
    const userId = req.user.id; // ID użytkownika z tokena

    const [result] = await db.promise().query(
      "INSERT INTO comments (recipe_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())",
      [recipeId, userId, content]
    );

    res.status(201).json({ id: result.insertId, message: "Comment added successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to add comment." });
  }
});

module.exports = router;
