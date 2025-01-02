import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Recognize from "./pages/Recognize";
import FavouriteFood from "./pages/FavouriteFood";
import Histories from "./pages/Histories";
import Accounts from "./pages/Accounts";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import Suggestion from "./pages/Suggestion";
import GuestPage from './pages/GuestPage'; // Trang khách vãng lai
import Header from "./components/Header";
import "./App.css";
import { AuthContext, AuthProvider } from "./common/AuthContext";
import { message } from "antd";

const App = () => {
  return (
    <AuthProvider>
      <Router>
      <Header /> 
        <Routes>
        
          {/* Trang khách vãng lai với Sidebar */}
          <Route path="/" element={<GuestPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<SignUpForm />} />

          {/* Các route cho người dùng đã đăng nhập */}
          <Route
            path="*"
            element={
              <PrivateRoute>
                <div className="dashboard">
                  <div className="w-[20vw]">
                    <Sidebar />
                  </div>
                  <div className="main !flex-1 !w-[80%] h-[100%] overflow-auto">
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/recognize" element={<Recognize />} />
                      <Route path="/histories" element={<Histories />} />
                      <Route path="/suggestion" element={<Suggestion />} />
                      <Route path="/favourite_food" element={<FavouriteFood />} />
                      <Route path="/account" element={<Accounts />} />
                    </Routes>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = React.useContext(AuthContext);
  
  if (!isLoggedIn) {
    message.warning("Vui lòng đăng nhập để truy cập trang này.");
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;
