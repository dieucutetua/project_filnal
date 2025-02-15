import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoPlus } from "react-icons/go";
import { AiOutlineUpload, AiOutlineInfoCircle } from "react-icons/ai";
import { Button, message, Modal } from "antd";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Recognize = () => {
  const [image_db, setImage_db] = useState([]); // Lưu trữ ảnh đã chọn
  const [isUploading, setIsUploading] = useState(false); // Trạng thái upload ảnh
  const [fileUpload, setFileUpload] = useState("");
  const [fileUploadReplace, setFileUploadReplace] = useState("");
  const [resultsUploadFile, setResultsUploadFile] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resultImagePaths, setResultImagePaths] = useState([]);
  const navigate = useNavigate();

  const context = useAppContext();

  const { setInputSearch } = context;

  const userID = localStorage.getItem("user_id");

  const handleOnChangeUploadFile = (event) => {
    if (
      event &&
      event.target &&
      event.target.files &&
      event.target.files.length > 0
    ) {
      setFileUpload((prev) => {
        if (prev.length > 0) {
          return [...prev, ...event.target.files];
        }
        return [...event.target.files];
      });
    }
  };

  const handleDeleteFileUpload = (nameFile) => {
    setFileUpload((prev) => {
      const newListFile = prev.filter((file) => file.name !== nameFile);
      return newListFile;
    });
  };

  const handleUpload = async () => {
    if (fileUpload.length === 0) {
      message.error("Please select images first.");
      return;
    }
    const formData = new FormData();
    Array.from(fileUpload).forEach((image) => {
      formData.append("files", image);
    });
    if (userID) {
      formData.append("user_id", userID);
    } else {
      message.error("User ID is missing.");
      return;
    }
    setIsUploading(true);
    try {
      const response = await axiosInstance.post("food/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);

      if (response.status === 200) {
        setFileUpload("");
        setResultsUploadFile([...response.data.detected_items]);
        setResultImagePaths([...response.data.result_image_paths]);
        setFileUploadReplace(fileUpload);
        message.success("Upload file success!");
      }
    } catch (error) {
      message.error("Upload file failed!");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchImages = async () => {
    const image_id = localStorage.getItem("image_id");
    if (!image_id) {
      return;
    }
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/image/user/${userID}/${image_id}`
      );
      setImage_db(response.data);
      console.log("image_db", response.data);
    } catch (err) {
      console.error("Không thể tải ảnh đã upload");
    }
  };

  const handleShowModal = () => setIsModalVisible(true);

  const handleNavigateWithSearchParams = () => {
    console.log(resultsUploadFile);

    setInputSearch(resultsUploadFile);
    navigate(`/suggestion`);
  };

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Trang nhận diện
      </h1>
      <div className="p-8 flex flex-col gap-6 mx-auto bg-white rounded-lg shadow-lg justify-center w-full">
        <h1 className="text-xl font-medium text-gray-800 w-full flex justify-center">
          Ảnh cần nhận diện
        </h1>
        <div className="flex flex-col gap-4 w-full items-center justify-center">
          <div className="flex gap-3 items-center">
            {fileUpload &&
              fileUpload.length > 0 &&
              fileUpload.map((file, index) => (
                <div
                  className="relative group w-36 h-36 flex justify-center items-center"
                  key={index}
                >
                  <div
                    className="absolute top-2 right-2 rounded-full text-red-500 group-hover:opacity-100 opacity-0 transition-opacity"
                    onClick={() => handleDeleteFileUpload(file.name)}
                  >
                    <MdDelete size={25} />
                  </div>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="upload-image"
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            <input
              type="file"
              accept="image/*"
              onChange={handleOnChangeUploadFile}
              id="upload-file"
              className="hidden"
              multiple
            />
            <label
              htmlFor="upload-file"
              className="custom-box-upload-file p-4 border-2 border-dashed rounded-lg text-center flex items-center justify-center cursor-pointer transition-all hover:bg-gray-100"
            >
              Chọn ảnh <GoPlus className="ml-2" />
            </label>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <Button
              style={{
                width: "150px",
                fontSize: "16px",
                borderRadius: "8px",
                padding: "10px 20px",
              }}
              type="primary"
              onClick={handleUpload}
              disabled={isUploading}
              className="transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400"
              icon={<AiOutlineUpload />}
            >
              {isUploading ? "Uploading..." : "Upload ảnh"}
            </Button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {fileUploadReplace.length > 0 &&
            fileUploadReplace.map((file, index) => (
              <div
                key={index}
                className="flex justify-center items-center flex-col"
              >
                <div className="custom-box-upload-file">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="upload-image"
                    className="w-[140px] h-fit rounded-lg"
                  />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <Button
            type="primary"
            onClick={handleShowModal}
            className="transition-all duration-300 ease-in-out transform hover:scale-105"
            style={{
              width: "150px",
              fontSize: "16px",
              borderRadius: "8px",
              padding: "10px 20px",
            }}
            icon={<AiOutlineInfoCircle />}
          >
            Chi tiết !
          </Button>
        </div>

        {/* ------------------------Suggestion-------------------------- */}
        <Modal
          title="Ảnh đã nhận diện"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <div className="flex flex-wrap gap-6 justify-center">
            {resultImagePaths.length > 0 &&
              resultImagePaths.map((path, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  style={{ width: "200px" }}
                >
                  <img
                    src={`http://127.0.0.1:8000/${path.replace(/\\/g, "/")}`} // Sửa đường dẫn để hiển thị ảnh
                    alt={`result-${index}`}
                    className="w-full h-auto rounded-lg shadow-md"
                    style={{
                      maxWidth: "300px",
                      height: "auto",
                    }}
                  />
                </div>
              ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Kết quả nhận diện</h3>
            <ul className="list-disc ml-5 text-lg">
              {resultsUploadFile.length > 0 &&
                resultsUploadFile.map((result, index) => (
                  <li key={index} className="mt-1 text-lg text-gray-700">
                    {result}
                  </li>
                ))}
            </ul>
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              type="primary"
              onClick={handleNavigateWithSearchParams} // Gọi hàm chuyển hướng
            >
              Xem gợi ý!
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Recognize;
