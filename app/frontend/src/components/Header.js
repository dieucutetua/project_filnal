import React from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "./Header.css"; 

const Header = () => {
  return (
    <header className="header bg-blue-600 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">HUNGRY EYES</h1>
      <div className="auth-buttons">
        <Link to="/login" className="auth-btn login-btn bg-blue-800 text-white py-2 px-4 rounded-lg flex items-center">
          <FaSignInAlt className="mr-2" />
          Đăng nhập
        </Link>
        <Link to="/register" className="auth-btn register-btn bg-green-600 text-white py-2 px-4 rounded-lg flex items-center ml-4">
          <FaUserPlus className="mr-2" />
          Đăng ký
        </Link>
      </div>
    </header>
  );
};

export default Header;
