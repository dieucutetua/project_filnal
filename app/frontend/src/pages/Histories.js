import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, createSearchParams } from "react-router-dom";
import { FaPlay, FaTrashAlt } from "react-icons/fa";
import "../css/Histories.css";
import { useAppContext } from "../context/AppContext";

const Histories = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(8);

  const user_id = localStorage.getItem("user_id");

  const context = useAppContext();

  const { setInputSearch } = context;

  const navigate = useNavigate();

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

  const handleNavigateWithSearchParams = async (detectedItems) => {
    await setInputSearch(detectedItems);
    navigate(`/suggestion`);
  };

  if (loading) return <p>Đang tải ảnh...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="histories-container p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Lịch sử
      </h1>
      <div className="img-list">
        {deleteError && <p className="text-red-500">{deleteError}</p>}
        {currentImages.length === 0 ? (
          <p className="text-lg text-center text-gray-600">
            Không có lịch sử tìm kiếm nào
          </p>
        ) : (
          currentImages.map((image) => (
            <div key={image.image_id} className="img-item">
              <div className="relative h-60 w-full rounded-t-lg overflow-hidden">
                <img
                  src={`http://127.0.0.1:8000/${image.image_path}`}
                  alt={`Image ${image.image_id}`}
                  className="object-cover w-full h-full transition-all duration-300 hover:opacity-80"
                />
              </div>
              <div className="p-4 bg-white rounded-b-lg shadow-inner">
                {/* Hiển thị kết quả nhận diện */}
                <div className="mb-4 text-sm text-gray-600">
                  <p className="font-semibold">Nhận diện:</p>
                  <ul>
                    {image.detected_items && image.detected_items.length > 0 ? (
                      image.detected_items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    ) : (
                      <li>Không có kết quả nhận diện.</li>
                    )}
                  </ul>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <p className="font-semibold">Ngày upload : </p>
                  <span className="flex items-center gap-1 text-gray-600">
                    {new Date(image.upload_time).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 flex justify-between bg-gray-100 rounded-b-lg">
                <div className="w-full flex justify-between gap-4">
                  <button
                    onClick={() =>
                      handleNavigateWithSearchParams(image.detected_items)
                    }
                    className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    <FaPlay className="text-white" />
                    Gợi ý
                  </button>
                  <button
                    onClick={() => deleteItem(image.image_id)}
                    className="bg-red-500 text-white hover:bg-red-600 py-2 px-6 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    <FaTrashAlt className="text-white" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls mt-6 flex justify-center gap-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 bg-blue-500 text-white py-2 px-4 rounded-full"
        >
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`transition-all duration-300 ease-in-out transform hover:scale-105 py-2 px-4 rounded-full ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 bg-blue-500 text-white py-2 px-4 rounded-full"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default Histories;
