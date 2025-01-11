import { message } from "antd";
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  const login = (email, isAdmin) => {
    localStorage.setItem("email", email);
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isAdmin, login, logout, setIsAdmin, setIsLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
