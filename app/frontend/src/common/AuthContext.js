import React, { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("user_id");
    setIsLoggedIn(!!userId);
 
    // setIsAdmin(email === "admin@email.com");

    setIsAdmin(userId === "admin"); 

  }, []);

  const login = (email, isAdmin) => {
    localStorage.setItem("email", email);
    setIsLoggedIn(true);
    setIsAdmin(isAdmin); // Cập nhật trạng thái isAdmin
  };
  
  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("user_id")
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn,isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
