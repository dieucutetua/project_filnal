import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { FaCamera, FaHistory, FaHeart, FaUser, FaHome } from "react-icons/fa"; // Biểu tượng từ react-icons

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <h2>Website</h2>
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                        <FaHome className="icon" />
                        <span>Trang chủ</span>
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
            </ul>
        </aside>
    );
};

export default Sidebar;
