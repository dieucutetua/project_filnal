import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import './LoginSignUpForm.css';
import { CiUser } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

const LoginSignUpForm = () => {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setName] = useState("");
  const [message, setMessage] = useState(""); // Thông báo hiển thị từ API
  const navigate = useNavigate(); // Hook để điều hướng

  // Hàm gửi yêu cầu đăng nhập
  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email and password are required.");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/users/login/", {
        email,
        password,
      });
      setMessage(response.data.message || "Login successful!");
      console.log("Login successful", response.data);

      // Lưu user_id vào localStorage
      if (response.data.user_id) {
        localStorage.setItem("user_id", response.data.user_id); // Lưu user_id
      }

      // Điều hướng đến trang nhận diện sau khi login thành công
      navigate("/recognize"); // Điều hướng tới trang nhận diện
    } catch (error) {
      setMessage("Login failed! Please check your credentials.");
      console.error("Login error", error);
    }
  };

  // Hàm gửi yêu cầu đăng ký
  const handleSignUp = async () => {
    if (!username || !email || !password) {
      setMessage("All fields are required.");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/users/register/", {
        username,
        email,
        password,
      });
      setMessage(response.data.message || "Sign Up successful!");
      console.log("Sign Up successful", response.data);

      // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
      setAction("Login"); // Đổi sang trang login sau khi đăng ký thành công
    } catch (error) {
      setMessage("Sign up failed! Please try again.");
      console.error("Sign up error", error);
    }
  };

  return (
    <div>
      <div className='container'>
        <div className='header'>
          <div className='text'>{action}</div>
          <div className='underline'></div>
        </div>
        <div className="inputs">
          {action === "Login" ? null : (
            <div className="input">
              <CiUser />
              <input
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => setName(e.target.value)} // Cập nhật state khi người dùng nhập tên
              />
            </div>
          )}

          <div className="input">
            <MdEmail />
            <input
              type="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Cập nhật state khi người dùng nhập email
            />
          </div>
          <div className="input">
            <RiLockPasswordLine />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Cập nhật state khi người dùng nhập password
            />
          </div>
        </div>
      </div>
      {action === "Sign Up" ? null : (
        <div className="forgot-password">
          Lost Password? <span>Click Here</span>
        </div>
      )}

      <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => {
            setAction("Sign Up");
            setMessage(""); // Reset message khi chuyển đổi giữa login/signup
          }}
        >
          Sign Up
        </div>
        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => {
            setAction("Login");
            setMessage(""); // Reset message khi chuyển đổi giữa login/signup
          }}
        >
          Login
        </div>
      </div>

      <div className="message">
        {message && <p>{message}</p>} {/* Hiển thị thông báo */}
      </div>

      {/* Gọi API khi nhấn nút */}
      <div className="submit" onClick={action === "Login" ? handleLogin : handleSignUp}>
        {action === "Login" ? "Login" : "Sign Up"}
      </div>
    </div>
  );
};

export default LoginSignUpForm;
