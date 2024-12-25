import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { BiFoodMenu } from "react-icons/bi";
import { FaCamera, FaHistory, FaHeart, FaUser, FaHome, FaSignOutAlt } from "react-icons/fa"; // Biểu tượng đăng xuất

const Sidebar = () => {
    const navigate = useNavigate();

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        // Xóa thông tin người dùng trong localStorage
        localStorage.removeItem("user_id");
        // Chuyển hướng về trang đăng nhập (hoặc trang chủ tùy ý)
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            <h2>Website</h2>
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
                {/* <li>
                    <NavLink to="/account" className={({ isActive }) => (isActive ? "active" : "")}>
                        <FaUser className="icon" />
                        <span>Cá nhân</span>
                    </NavLink>
                </li> */}
            </ul>
            <div className="logout-container" onClick={handleLogout}>
                <FaSignOutAlt className="logout-icon" />
            </div>
            {/* Biểu tượng đăng xuất */}
          
        </aside>
    );
};

export default Sidebar;
