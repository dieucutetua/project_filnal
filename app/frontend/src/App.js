import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Recognize from "./pages/Recognize";
import FavoriteFood from "./pages/FavouriteFood";
import Histories from "./pages/Histories";
import Accounts from "./pages/Accounts";
import LoginSignUpForm from "./components/LoginSignUpForm/LoginSignUpForm";
import LogoutButton from "./components/Logout";
import "./App.css";

const App = () => {
  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = localStorage.getItem("user_id"); // Kiểm tra user_id trong localStorage

  return (
    <Router>
      <Routes>
        {/* Route dành cho đăng nhập */}
        <Route path="/login" element={<LoginSignUpForm />} />

        {/* Route chính chỉ hiển thị khi người dùng đã đăng nhập */}
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
              // Nếu chưa đăng nhập, chuyển hướng tới trang login
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
