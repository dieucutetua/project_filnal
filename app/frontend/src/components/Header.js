import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md border-b px-4 py-3 flex justify-between items-center top-0 sticky">
      <div className="ml-auto flex space-x-4">
        <Link to="/login">
          <Button
            type="primary"
            size="large"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Đăng Nhập
          </Button>
        </Link>
        <Link to="/register">
          <Button
            type="default"
            size="large"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Đăng Ký
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
