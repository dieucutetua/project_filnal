import React, { useState, useEffect } from "react";
import axios from "axios";

const Histories = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [imagesPerPage] = useState(7); // Số ảnh mỗi trang

  // Lấy user_id từ localStorage
  const user_id = localStorage.getItem("user_id");
  const email = localStorage.getItem("email");

  console.log("User ID:", user_id); // Kiểm tra user_id

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/image/user/${user_id}`
        );
        setImages(response.data);
      } catch (err) {
        setError("Không thể tải ảnh của người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [user_id]);


  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);


  const totalPages = Math.ceil(images.length / imagesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <p>Đang tải ảnh...</p>;
  if (error) return <p>{error}</p>;

  const deleteItem = async (image_id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/image/user/${user_id}/${image_id}`
      );
      setImages((prevImages) => prevImages.filter((image) => image.image_id !== image_id));
    } catch (err) {
      setDeleteError("Không thể xóa");
    }
  };

  return (
    <div>
      <h3>Danh sách ảnh của người dùng {email}</h3>
      <div className="image-list">
        {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
        {currentImages.length === 0 ? (
          <p>Không có lịch sử tìm kiếm nào</p>
        ) : (
          currentImages.map((image) => (
            <div key={image.image_path} className="image-item">
              <img
                src={`http://127.0.0.1:8000/${image.image_path}`}
                alt={`Image ${image.image_id}`}
                width="200"
              />
              <p>Thời gian tải lên: {new Date(image.upload_time).toLocaleString()}</p>
              <p>Đã nhận diện: {image.detected_items.join(", ")}</p>
              <button
                onClick={() => deleteItem(image.image_id)}
                style={{ color: "red" }}
              >
                Xóa
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default Histories;
