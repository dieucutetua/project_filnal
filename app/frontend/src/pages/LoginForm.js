import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { message } from "antd";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../common/AuthContext";
import '../css/Login.css'
import bgr_image from "../components/assets/bgr_image.jpg"

const LoginForm = () => {
  const sizeIcon = 25;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      message.error("Email and password are required.");
      return;
    }
    try {
      const response = await axiosInstance.post("users/login/", {
        email,
        password,
      });
      if (response.status === 200) {
        if (response.data.user_id) {
          localStorage.setItem("user_id", response.data.user_id);
        }
        if (response.data.email) {
          localStorage.setItem("email", response.data.email);
        }
        login();
        message.success("Login success!");
        navigate("/home");
      }
      console.log("Login successful", response);
    } catch (error) {
      message.error("Login failt!");
      console.error("Login error", error);
    }
  };

  const handleClickToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="container-login-form"
    style={{
      backgroundImage: `url(${bgr_image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh"
    }}>
      <div className="container-login">
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
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
        <button className="submit" onClick={handleLogin}>
          Login
        </button>
        <div className="register-text">
          <p>You don't have an account yet?</p>
          <a className="register-link" onClick={handleClickToRegister}>
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
