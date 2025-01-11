import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../common/AuthContext";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [inputSearch, setInputSearch] = useState("");
  const navigate = useNavigate();

  const context = useContext(AuthContext);
  const { setIsLoggedIn, setIsAdmin } = context;

  useEffect(() => {
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setIsLoggedIn(true);
    } else {
      navigate("/login");
    }

    // setIsAdmin(email === "admin@email.com");

    setIsAdmin(userId === "admin");
  }, []);
  return (
    <AppContext.Provider
      value={{
        inputSearch,
        setInputSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
