const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.json());

app.use(
    cors({
      origin: "http://localhost:3000", // Domena frontendowa
      credentials: true,              // Zezwalaj na przesyłanie ciastek
      allowedHeaders: ["Content-Type", "Authorization"], // Zezwól na Authorization
    })
);

const recipeRoutes = require("./routes/recipeRoutes");
const commentRoutes = require("./routes/commentRoutes"); // Dodano

app.use("/api/recipes", recipeRoutes);
app.use("/api/comments", commentRoutes); // Dodano

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
