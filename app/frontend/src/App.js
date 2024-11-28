import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Recognize from "./pages/Recognize";
import FavoriteFood from "./pages/FavouriteFood";
import Histories from "./pages/Histories";
import Accounts from "./pages/Accounts";
import LoginForm from "./pages/LoginForm";
import "./App.css";
import SignUpForm from "./pages/SignUpForm";

const App = () => {
  const isLoggedIn = localStorage.getItem("user_id");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />

        <Route path="/register" element={<SignUpForm />} />
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <div className="dashboard">
                <Sidebar />
                <div className="main">
                  <Routes>
                    <Route path="/" element={<Navigate to="/recognize" />} />
                    <Route path="/recognize" element={<Recognize />} />
                    <Route path="/histories" element={<Histories />} />
                    <Route path="/favorite-food" element={<FavoriteFood />} />
                    <Route path="/account" element={<Accounts />} />
                  </Routes>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
