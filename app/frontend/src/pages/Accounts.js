import React from "react";
import Logout from '../components/Logout'

const Accounts = () => {
    const email = localStorage.getItem('email');
    return (
        <div>
            <h1>Tài khoản {email}</h1>
            <p>Quản lí thông tin người dùng</p>
            <Logout />
        </div>
    );
};

export default Accounts;
