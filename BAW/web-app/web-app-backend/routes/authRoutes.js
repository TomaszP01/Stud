const express = require('express');
const bcrypt = require('bcrypt');
const authMiddleware = require("../middleware/authMiddleware");
const db = require('../config/db'); // Konfiguracja połączenia z bazą danych
const generateToken = require('../utils/jwt'); // Import generatora tokenów
const router = express.Router();

// Rejestracja użytkownika
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    // Sprawdzenie, czy wszystkie dane zostały podane
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    try {
        // Sprawdzenie, czy użytkownik już istnieje
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Użytkownik z podanym e-mailem już istnieje' });
        }

        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(password, 10);

        // Dodanie użytkownika do bazy danych
        await db.promise().query('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);

        res.status(201).json({ message: 'Użytkownik zarejestrowany pomyślnie, mozesz teraz przejsc do panelu logowania i zalogowac sie' });
    } catch (error) {
        console.error('Błąd podczas rejestracji:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera' });
    }
});

// Logowanie użytkownika
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Sprawdzenie, czy wszystkie dane zostały podane
    if (!email || !password) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    try {
        // Pobranie użytkownika z bazy danych
        const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Nieprawidłowy e-mail lub hasło' });
        }

        const dbUser = user[0];

        // Sprawdzenie poprawności hasła
        const isPasswordValid = await bcrypt.compare(password, dbUser.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Nieprawidłowy e-mail lub hasło' });
        }

        // Generowanie tokena JWT za pomocą dedykowanej funkcji
        const token = generateToken({ id: dbUser.id, email: dbUser.email });

        res.status(200).json({ message: 'Zalogowano pomyślnie', token });
    } catch (error) {
        console.error('Błąd podczas logowania:', error);
        res.status(500).json({ message: 'Wystąpił błąd serwera' });
    }
});

router.get("/verify-token", authMiddleware, (req, res) => {
    res.status(200).json({ valid: true, user: req.user });
});

module.exports = router;
