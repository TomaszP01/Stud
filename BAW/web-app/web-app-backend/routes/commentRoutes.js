const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db"); // Konfiguracja połączenia z bazą danych

// Pobierz komentarze użytkownika
router.get("/my-comments", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
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

// Pobierz komentarze dla konkretnego przepisu
router.get("/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;

    const [comments] = await db.promise().query(
      `SELECT c.id, c.content, c.created_at, u.name AS username,
              c.user_id = ? AS canEdit
       FROM comments c
       JOIN users u ON c.user_id = u.id
       JOIN comment_sections cs ON c.comment_section_id = cs.id
       WHERE cs.recipe_id = ? ORDER BY c.created_at DESC;`,
      [req.user?.id || null, recipeId]
    );

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch comments." });
  }
});

// Dodaj komentarz
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { recipe_id, content } = req.body;
    const userId = req.user.id;

    if (!content.trim()) {
      return res.status(400).json({ message: "Treść komentarza nie może być pusta." });
    }

    const [section] = await db.promise().query(
      "SELECT id FROM comment_sections WHERE recipe_id = ?",
      [recipe_id]
    );

    if (section.length === 0) {
      return res.status(404).json({ message: "Sekcja komentarzy nie istnieje dla tego przepisu." });
    }

    const comment_section_id = section[0].id;

    await db.promise().query(
      "INSERT INTO comments (comment_section_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())",
      [comment_section_id, userId, content]
    );

    res.status(201).json({ message: "Komentarz dodany pomyślnie!" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Błąd serwera." });
  }
});

// Usunięcie komentarza
router.delete("/delete-comment/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Sprawdzenie, czy komentarz należy do użytkownika
    const [comment] = await db.promise().query(
      "SELECT * FROM comments WHERE id = ? AND user_id = ?",
      [commentId, userId]
    );

    if (comment.length === 0) {
      return res.status(403).json({ message: "You are not allowed to delete this comment." });
    }

    // Usunięcie komentarza
    await db.promise().query("DELETE FROM comments WHERE id = ?", [commentId]);

    res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete comment." });
  }
});


module.exports = router;


