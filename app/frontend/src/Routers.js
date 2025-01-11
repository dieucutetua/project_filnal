import React, { useContext } from "react";
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
import GuestPage from "./pages/GuestPage";
import Admin from "./pages/Admin";
import { AuthContext, AuthProvider } from "./common/AuthContext";
import { message } from "antd";
import { AppProvider } from "./context/AppContext";

// Router Component
const Routers = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<GuestPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<SignUpForm />} />{" "}
          <Route
            path="*"
            element={
              <div className="dashboard">
                <div className="w-[20vw]">
                  <Sidebar />
                </div>
                <div className="main !flex-1 !w-[80%] h-[100%] overflow-auto">
                  <AppProvider>
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/recognize" element={<Recognize />} />
                      <Route path="/histories" element={<Histories />} />
                      <Route path="/suggestion" element={<Suggestion />} />
                      <Route
                        path="/favourite_food"
                        element={<FavouriteFood />}
                      />
                      <Route path="/account" element={<Accounts />} />
                      {/* AdminRoute bảo vệ trang admin */}
                      {/* <Route path="/admin" element={<Admin />} /> */}
                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <Admin />
                          </AdminRoute>
                        }
                      />
                    </Routes>
                  </AppProvider>{" "}
                </div>
              </div>
            }
          />
        </Routes>{" "}
      </AuthProvider>
    </Router>
  );
};

// AdminRoute bảo vệ trang admin
const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);
  if (!isLoggedIn || !isAdmin) {
    message.warning("Bạn không có quyền truy cập trang này.");
    return <Navigate to="/home" />;
  }
  return children;
};

export default Routers;
