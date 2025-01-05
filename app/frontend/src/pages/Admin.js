import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

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
        setErrorMessage("There was an error fetching the users.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    try {
      await axiosInstance.delete(`admin/delete_user/${email}`);
      setUsers(users.filter(user => user.email !== email));  // Cập nhật lại danh sách người dùng sau khi xóa
      setSuccessMessage(`User with email ${email} has been deleted.`);
      setErrorMessage(""); // Xóa thông báo lỗi (nếu có)
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("There was an error deleting the user.");
      setSuccessMessage(""); // Xóa thông báo thành công (nếu có)
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Dashboard</h1>
      
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}

      <table style={{ width: "100%", border: "1px solid #ddd", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f4f4f4" }}>
          <tr>
            <th style={{ padding: "10px", textAlign: "left" }}>Username</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Created At</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td style={{ padding: "10px" }}>{user.username}</td>
              <td style={{ padding: "10px" }}>{user.email}</td>
              <td style={{ padding: "10px" }}>{user.created_at}</td>
              <td style={{ padding: "10px" }}>
                <button 
                  onClick={() => handleDelete(user.email)} 
                  style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>
                  Delete
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
