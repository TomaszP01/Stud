import React, { useState } from "react";
import RecipesList from './components/RecipesList';
import AddRecipe from './components/AddRecipe';
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
    const [view, setView] = useState("login"); // 'login' or 'register'
  
    return (
      <div className="App">
        <h1>Welcome to Recipe Sharing Platform</h1>
        <div>
          <button onClick={() => setView("login")}>Login</button>
          <button onClick={() => setView("register")}>Register</button>
        </div>
        {view === "login" ? <Login /> : <Register />}
      </div>
    );
  }

export default App;
