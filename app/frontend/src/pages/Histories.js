import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, createSearchParams } from "react-router-dom";
import "../css/Histories.css";

const Histories = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const [imagesPerPage] = useState(8);
  const [resultsUploadFile, setResultsUploadFile] = useState("");

  const user_id = localStorage.getItem("user_id");
  const email = localStorage.getItem("email");

  const navigate = useNavigate();  // Khởi tạo useNavigate

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

  const deleteItem = async (image_id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/image/user/${user_id}/${image_id}`
      );
      setImages((prevImages) =>
        prevImages.filter((image) => image.image_id !== image_id)
      );
    } catch (err) {
      setDeleteError("Không thể xóa");
    }
  };

   const handleNavigateWithSearchParams = (detectedItems) => {
          const params = createSearchParams({
              ingredients: JSON.stringify(detectedItems), // Chuyển kết quả nhận diện thành chuỗi JSON
          });
          navigate(`/suggestion?${params}`);
      };
  

  if (loading) return <p>Đang tải ảnh...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="histories-container">
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
                className="image-preview"
              />
              <p className="image-time">
                Thời gian tải lên:{" "}
                {new Date(image.upload_time).toLocaleString()}
              </p>
              <p className="image-detected">
                Đã nhận diện: {image.detected_items.join(", ")}
              </p>
              <div>
                <button
                  onClick={() => deleteItem(image.image_id)}
                  className="delete-button"
                >
                  Xóa
                </button>
                <button
                  // Gửi detectedItems đến Suggestion
                  className="suggestion-button"
                  type="primary"
                  onClick={() => {
                      handleNavigateWithSearchParams(image.detected_items); // Gọi hàm chuyển hướng
                  }}
                >
                  Gợi ý
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default Histories;
