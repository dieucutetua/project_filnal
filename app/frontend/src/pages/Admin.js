import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaTrash } from "react-icons/fa";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Giả sử bạn đã lấy dữ liệu từ API getall_users và dữ liệu trả về giống như ví dụ bạn cung cấp.
        const response = await axiosInstance.get("admin/getall_users/");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("Đã xảy ra lỗi khi tìm kiếm người dùng.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    try {
      await axiosInstance.delete(`admin/delete_user/${email}`);
      setUsers(users.filter((user) => user.email !== email));
      setSuccessMessage(`Đã xóa ${email} `);
      setErrorMessage("");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("Đã xảy ra lỗi khi xóa người dùng.");
      setSuccessMessage("");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* <h1 style={{ fontSize: "2rem", marginBottom: "20px", textAlign: "center" }}>User Dashboard</h1> */}
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Quản lí người dùng
      </h1>
      {errorMessage && (
        <div
          style={{ color: "red", marginBottom: "20px", textAlign: "center" }}
        >
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div
          style={{ color: "green", marginBottom: "20px", textAlign: "center" }}
        >
          {successMessage}
        </div>
      )}

      <table
        style={{
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          borderCollapse: "collapse",
        }}
      >
        <thead
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            fontSize: "1.1rem",
          }}
        >
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>Tên</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Ngày đăng kí</th>
            <th style={{ padding: "12px", textAlign: "left" }}></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "12px" }}>{user.username}</td>
              <td style={{ padding: "12px" }}>{user.email}</td>
              <td style={{ padding: "12px" }}>{user.created_at}</td>
              <td style={{ padding: "12px" }}>
                <button
                  onClick={() => handleDelete(user.email)}
                  style={{
                    backgroundColor: "transparent",
                    color: "red",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "#cc2e2e")}
                  onMouseOut={(e) => (e.target.style.color = "red")}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
