import React, { useState, useEffect } from "react";
import axios from "axios";

const Histories = ({ }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Lấy user_id từ localStorage
  const user_id = localStorage.getItem('user_id');
  console.log("User ID:", user_id);  // Kiểm tra user_id
  useEffect(() => {

    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/image/user/${user_id}`);
        setImages(response.data);
      } catch (err) {
        setError("Không thể tải ảnh của người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [user_id]);


  // // Gọi API để lấy tất cả ảnh của user
  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const response = await axios.get(`http://127.0.0.1:8000/image/user/${user_id}`);
  //       setImages(response.data); // Gán dữ liệu ảnh nhận được vào state
  //     } catch (err) {
  //       setError("Không thể tải ảnh của người dùng.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchImages();
  // }, [user_id]);

  // Nếu đang tải hoặc có lỗi
  if (loading) return <p>Đang tải ảnh...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Danh sách ảnh của người dùng {user_id}</h3>
      <div className="image-list">
        {images.length === 0 ? (
          <p>Không có ảnh nào.</p>
        ) : (
          images.map(image => (
            <div key={image.image_path} className="image-item">
              <img src={`http://127.0.0.1:8000/${image.image_path}`} alt={`Image ${image.image_id}`} width="200" />
              <p>Thời gian tải lên: {new Date(image.upload_time).toLocaleString()}</p>
              <p>Đã nhận diện: {image.detected_items.join(", ")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Histories;
