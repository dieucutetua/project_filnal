import React from "react";
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

  return (
    <Router>
      <div className="dashboard">
        <Routes>
          {/* Route Login sẽ hiển thị ngay khi ứng dụng bắt đầu */}
          <Route path="/login" element={<LoginSignUpForm />} />

          {/* Route chính chỉ hiển thị khi người dùng đã đăng nhập */}
          <Route
            path="*"
            element={
              <div className="dashboard">
                <Sidebar />
                <div className="main">
                  <Routes>
                    <Route path="/" element={<Navigate to="/recognize" />} />
                    <Route path="/recognize" element={<Recognize />} />
                    <Route path="/histories" element={<Histories />} />
                    <Route path="/favorite-food" element={<FavoriteFood />} />
                    <Route path="/account" element={<Accounts />} />
                    {/* Thêm LogoutButton ở bất kỳ đâu trong các trang bên dưới */}
                  </Routes>
                  <LogoutButton />
                </div>
              </div>
              ) : (
          // Nếu chưa đăng nhập, chuyển hướng đến trang login
          <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
