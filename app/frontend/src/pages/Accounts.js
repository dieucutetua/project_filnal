import React from "react";
import Logout from '../components/Logout'

const Accounts = () => {
    const email = localStorage.getItem('email');
    return (
        <div>
            <h1>Accounts {email}</h1>
            <p>Welcome to the Accounts Food page.</p>
            {/* <Logout /> */}
        </div>
    );
};

export default Accounts;
