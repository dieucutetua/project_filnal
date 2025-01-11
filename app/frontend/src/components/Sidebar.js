import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { BiFoodMenu } from "react-icons/bi";
import {
  FaCamera,
  FaHistory,
  FaHeart,
  FaUser,
  FaHome,
  FaSignOutAlt,
  FaRegMehRollingEyes,
  FaCog,
} from "react-icons/fa";

const Sidebar = ({ isGuest }) => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const isAdmin = email === "admin@email.com";

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="!text-[25px] flex justify-center items-center">
        <FaRegMehRollingEyes className="icon" />
        Con mắt đói
      </h2>
      <ul>
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaHome className="icon" />
            <span>Trang Chủ</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/recognize"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaCamera className="icon" />
            <span>Nhận diện</span>
          </NavLink>
        </li>
        {/* Sidebar cho khách vãng lai sẽ không có các mục yêu cầu đăng nhập */}
        {!isGuest && (
          <>
            <li>
              <NavLink
                to="/histories"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaHistory className="icon" />
                <span>Lịch sử</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/suggestion"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <BiFoodMenu className="icon" />
                <span>Gợi ý</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/favourite_food"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaHeart className="icon" />
                <span>Yêu thích</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/account"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaUser className="icon" />
                <span>Cá nhân</span>
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaCog className="icon" />
                  <span>Admin</span>
                </NavLink>
              </li>
            )}
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
