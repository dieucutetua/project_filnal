import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { message } from "antd";
import axiosInstance from "../utils/axiosInstance";
import bgr_image from "../components/assets/bgr_image.jpg"
import '../css/SignUp.css'

const SignUpForm = () => {
  const sizeIcon = 25;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      return;
    }
    try {
      const response = await axiosInstance.post("users/register/", {
        username,
        email,
        password,
      });
      if (response.status === 200) {
        message.success("Sign up success!");
        navigate("/login");
      }
      console.log(response);
    } catch (error) {
      message.error("Sign up fail!");
      console.error("Sign up error", error);
    }
  };

  const handleClickToLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="container-register-form"
      style={{
        backgroundImage: `url(${bgr_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="container-register">
        <div className="header">
          <div className="text">Register</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <CiUser size={sizeIcon} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input">
            <MdEmail size={sizeIcon} />
            <input
              type="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <RiLockPasswordLine size={sizeIcon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button className="submit" onClick={handleSignUp}>
          Register
        </button>
        <div className="register-text">
          <p>You already have an account?</p>
          <a className="register-link" onClick={handleClickToLogin}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
