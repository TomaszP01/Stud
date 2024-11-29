const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost', // Adres serwera MySQL
    user: 'root',      // Użytkownik bazy danych
    password: 'rootpasswd12#', // Hasło użytkownika
    database: 'WebAppDB', // Nazwa bazy danych
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;