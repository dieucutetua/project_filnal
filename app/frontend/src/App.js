import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Recognize from "./pages/Recognize";
import FavoriteFood from "./pages/FavouriteFood";
import Histories from "./pages/Histories";
import Accounts from "./pages/Accounts";
import LoginSignUpForm from "./components/LoginSignUpForm/LoginSignUpForm";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="dashboard">
        <Routes>
          {/* Các route Login và SignUp */}
          <Route path="/login" element={<LoginSignUpForm />} />


          {/* Route chính chỉ hiển thị khi người dùng đã đăng nhập */}
          <Route
            path="*"
            element={
              <div className="dashboard">
                <Sidebar />
                <div className="main">
                  <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/recognize" element={<Recognize />} />
                    <Route path="/histories" element={<Histories />} />
                    <Route path="/favorite-food" element={<FavoriteFood />} />
                    <Route path="/account" element={<Accounts />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
