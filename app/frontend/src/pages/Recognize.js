import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoPlus } from "react-icons/go";
import { Button, message, Modal } from "antd";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, createSearchParams } from "react-router-dom";

const Recognize = () => {
    const [image_db, setImage_db] = useState([]); // Lưu trữ ảnh đã chọn
    const [isUploading, setIsUploading] = useState(false); // Trạng thái upload ảnh
    const [fileUpload, setFileUpload] = useState("");
    const [fileUploadReplace, setFileUploadReplace] = useState("");
    const [resultsUploadFile, setResultsUploadFile] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [resultImagePaths, setResultImagePaths] = useState([]);
    const navigate = useNavigate();
    
    const userID = localStorage.getItem("user_id");

    const handleOnChangeUploadFile = (event) => {
        if(event && event.target && event.target.files && event.target.files.length > 0) {
            setFileUpload((prev) => {
                if(prev.length > 0) {
                    return [...prev, ...event.target.files];
                }
                return [...event.target.files];
            });
        }
    }
    
    const handleDeleteFileUpload = (nameFile) => {
        setFileUpload((prev) => {
            const newListFile = prev.filter((file) => file.name !== nameFile);
            return newListFile;
        });
    }

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
            
            if(response.status === 200){
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
            const response = await axios.get(`http://127.0.0.1:8000/image/user/${userID}/${image_id}`);
            setImage_db(response.data);
            console.log("image_db", response.data);
        } catch (err) {
            console.error("Không thể tải ảnh đã upload");
        }
    };

    const handleShowModal = () => setIsModalVisible(true);
    const handleCloseModal = () => setIsModalVisible(false);

    // Chuyển qua trang suggestion và truyền resultsUploadFile
    const handleNavigateWithSearchParams = () => {
        const params = createSearchParams({
            ingredients: JSON.stringify(resultsUploadFile), // Chuyển kết quả nhận diện thành chuỗi JSON
        });
        navigate(`/suggestion?${params}`);
    };

    return (
        <div className="p-8 flex flex-col gap-2">
            <h1 className="text-xl font-medium">Ảnh cần nhận diện</h1>
            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    {fileUpload && fileUpload.length > 0 && fileUpload.map((file, index) => {
                        return (
                            <div className="custom-box-upload-file relative group" key={index}>
                                <div className="rounded-full text-red-500 group-hover:opacity-100 opacity-0 right-2 top-2 absolute"
                                     onClick={() => handleDeleteFileUpload(file.name)}>
                                    <MdDelete size={25} />
                                </div>
                                <img src={URL.createObjectURL(file)} alt="upload-image" className="w-[140px] h-fit"/>
                            </div>
                        );
                    })}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleOnChangeUploadFile}                    
                        id="upload-file"
                        className="hidden"
                        multiple
                    />
                    <label htmlFor="upload-file" className="custom-box-upload-file">
                        Chọn ảnh
                        <GoPlus />
                    </label>
                </div>
                <Button
                    style={{ width: "100px" }}
                    type="primary"
                    onClick={handleUpload}
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Thêm ảnh"}
                </Button>
            </div>
            <div className="flex gap-2">
                {fileUploadReplace.length > 0 && fileUploadReplace.map((file, index) => {
                    return (
                        <div className="flex justify-center items-center flex-col" key={index}>
                            <div className="custom-box-upload-file">
                                <img src={URL.createObjectURL(file)} alt="upload-image" className="w-[140px] h-fit"/>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* <ul className="flex flex-col gap-2 list-disc pl-5">
                {resultsUploadFile.length > 0 && resultsUploadFile.map((result, index) => (
                    <li className="w-[140px]" key={index}>
                    <p>{result}</p>
                    </li>
                ))}
                </ul> */}
            <div className="flex gap-2">
                <Button type="primary" onClick={() => { 
                    handleShowModal(); 
                }}>
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
                                    style={{
                                        maxWidth: "300px", // Tăng kích thước ảnh
                                        height: "auto",    // Đảm bảo tỉ lệ ảnh
                                    }}
                                />
                            </div>
                        ))}
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Kết quả nhận diện</h3>
                    <ul className="list-disc ml-5">
                        {resultsUploadFile.length > 0 &&
                            resultsUploadFile.map((result, index) => (
                                <li key={index} className="mt-1 text-lg">
                                    {result}
                                </li>
                            ))}
                    </ul>
                </div>
                <Button
                    type="primary"
                    onClick={() => {
                        handleNavigateWithSearchParams(); // Gọi hàm chuyển hướng
                    }}
                >
                    Xem gợi ý!
                </Button>
            </Modal>
        </div>
    );
};

export default Recognize;
