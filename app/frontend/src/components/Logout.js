import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await localStorage.removeItem("user_id");
    await localStorage.removeItem("email");
    navigate("/login");
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
      }}
    >
      Đăng xuất
    </button>
  );
};

export default LogoutButton;
