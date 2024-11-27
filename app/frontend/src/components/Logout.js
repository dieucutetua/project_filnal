import React from "react";

const LogoutButton = () => {
    const handleLogout = () => {
        // Xóa user_id khỏi localStorage
        localStorage.removeItem('user_id');

        // Chuyển hướng về trang đăng nhập
        window.location.href = "/login";
    };

    return (
        <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>
            Đăng xuất
        </button>
    );
};

export default LogoutButton;
