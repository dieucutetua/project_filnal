import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Recognize from "./pages/Recognize";
import FavoriteFood from "./pages/FavouriteFood";
import Histories from "./pages/Histories";
import Accounts from "./pages/Accounts";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="dashboard">
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<Histories />} />
            <Route path="/recognize" element={<Recognize />} />
            <Route path="/histories" element={<Histories />} />
            <Route path="/favourite_food" element={<FavoriteFood />} />
            <Route path="/account" element={<Accounts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
