const jwt = require('jsonwebtoken');

// Funkcja generowania tokena
const generateToken = (user) => {
    if (!user || !user.id) {
        throw new Error("User data is missing or incomplete");
    }

    // Payload tokena (dane, które chcesz przechowywać)
    const payload = {
        id: user.id,
        email: user.email,
    };

    // Generowanie tokena
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
