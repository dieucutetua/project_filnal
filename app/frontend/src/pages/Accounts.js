import React, { useState } from "react";
import Logout from "../components/Logout";
import axiosInstance from "../utils/axiosInstance";

const Accounts = () => {
  const email = localStorage.getItem("email");
  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const user_id = localStorage.getItem("user_id");

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp hay không
    if (new_password !== confirmPassword) {
      setMessage("Mật khẩu mới không khớp.");
      return;
    }

    try {
      console.log({
        user_id,
        old_password,
        new_password,
      });
      const response = await axiosInstance.put("/users/update-password", {
        user_id,
        old_password,
        new_password,
      });

      if (response.status === 200) {
        setMessage("Thay đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(response.data.message || "Đã xảy ra lỗi.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data?.message || "Lỗi kết nối đến server.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Thay đổi mật khẩu ! </h1>
      {/* <h1 className="mb-3">Tài khoản {email}</h1> */}

      <form onSubmit={handlePasswordChange} className="mb-4">
        <div className="mb-2">
          <label className="block mb-1">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={old_password}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border p-2 "
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Mật khẩu mới</label>
          <input
            type="password"
            value={new_password}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 "
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Nhập lại mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 "
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thay đổi mật khẩu
        </button>
      </form>

      {message && (
        <p
          className={`text-${
            message.includes("thành công") ? "green" : "red"
          }-500`}
        >
          {message}
        </p>
      )}

      <Logout />
    </div>
  );
};

export default Accounts;
