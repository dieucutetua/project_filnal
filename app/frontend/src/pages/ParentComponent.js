// // ParentComponent.js
// import React, { useState, useEffect } from "react";
// import Histories from "./Histories"; // Import component Histories

// const ParentComponent = () => {
//     // Giả sử giá trị user_id được lấy từ localStorage, API, hoặc từ một nơi khác
//     const [user_id, setUserId] = useState(null);

//     useEffect(() => {
//         // Lấy user_id từ localStorage (hoặc từ nơi khác)
//         const savedUserId = localStorage.getItem('user_id');
//         if (savedUserId) {
//             setUserId(savedUserId); // Lưu giá trị user_id vào state
//         }
//     }, []);

//     // Nếu chưa có user_id, hiển thị một thông báo hoặc một component khác
//     if (!user_id) {
//         return <p>Đang tải thông tin người dùng...</p>;
//     }

//     return <Histories user_id={user_id} />; // Truyền user_id vào Histories như một prop
// };

// export default ParentComponent;
