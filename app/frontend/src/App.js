import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Recognize from "./pages/Recognize";
import FavouriteFood from "./pages/FavouriteFood";
import Histories from "./pages/Histories";
import Accounts from "./pages/Accounts";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import Suggestion from "./pages/Suggestion"
import "./App.css";
import { AuthContext, AuthProvider } from "./common/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<SignUpForm />} />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <div className="dashboard">
                  <Sidebar />
                  <div className="main">
                    <Routes>
                      <Route path="/" element={<Navigate to="/recognize" />} />
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
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default App;
