import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { message } from 'antd'; // Thêm import message từ antd nếu chưa có
import { AuthContext } from "../common/AuthContext"; // Thêm import AuthContext
import "./Sidebar.css";
import { BiFoodMenu } from "react-icons/bi";
import { FaCamera, FaHistory, FaHeart, FaUser, FaHome, FaSignOutAlt, FaRegMehRollingEyes } from "react-icons/fa";

const Sidebar = ({ isGuest }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const handleNavigate = (to) => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để truy cập trang này.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2><FaRegMehRollingEyes className="icon" /> HUNGRY EYES</h2>
      <ul>
        <li>
          <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaHome className="icon" />
            <span>Trang Chủ</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/recognize" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaCamera className="icon" />
            <span>Nhận diện</span>
          </NavLink>
        </li>
        {/* Sidebar cho khách vãng lai sẽ không có các mục yêu cầu đăng nhập */}
        {!isGuest && (
          <>
            <li>
              <NavLink to="/histories" className={({ isActive }) => (isActive ? "active" : "")}>
                <FaHistory className="icon" />
                <span>Lịch sử</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/suggestion" className={({ isActive }) => (isActive ? "active" : "")}>
                <BiFoodMenu className="icon" />
                <span>Gợi ý</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/favourite_food" className={({ isActive }) => (isActive ? "active" : "")}>
                <FaHeart className="icon" />
                <span>Yêu thích</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/account" className={({ isActive }) => (isActive ? "active" : "")}>
                <FaUser className="icon" />
                <span>Cá nhân</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
      {/* Hiển thị nút Đăng xuất chỉ cho người dùng đã đăng nhập */}
      {!isGuest && (
        <div className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="icon" /><span>Đăng xuất</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
