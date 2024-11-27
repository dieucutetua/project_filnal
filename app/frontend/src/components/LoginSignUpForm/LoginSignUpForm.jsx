import React, { useState } from 'react';
import './LoginSignUpForm.css'
import { CiUser } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";


// function LoginSignUpForm({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

// const handleSubmit = (e) => {
//   e.preventDefault();
//   onLogin(email, password);
// };
const LoginSignUpForm = () => {
  const [action, setAction] = useState("Login")

  return (
    <div>
      <div className='container'>
        <div className='header'>
          <div className='text'>{action}</div>
          <div className='underline'></div>
        </div>
        <div className="inputs">
          {action === "Login" ? <div></div> : <div className="input">
            <CiUser />
            <input type="text" placeholder='Name' />
          </div>}

          <div className="input">
            <MdEmail />
            <input type="email" placeholder='Email Id' />
          </div>
          <div className="input">
            <RiLockPasswordLine />
            <input type="password" placeholder='Password' />
          </div>
        </div>
      </div>
      {action === "Sign Up" ? <div></div> : <div className="forgot-password">Lost Password ?<span>Click Here</span></div>}

      <div className="submit-container">
        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
      </div>
    </div>
  );
}

export default LoginSignUpForm;
