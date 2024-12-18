import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoPlus } from "react-icons/go";
import { Button, message } from "antd";
import { MdDelete } from "react-icons/md";
import { Modal } from "antd";
import { MdFavoriteBorder,MdFavorite  } from "react-icons/md";
import { CiZoomIn } from "react-icons/ci";
import { CiZoomOut } from "react-icons/ci";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Recognize = () => {
    const [image_db, setImage_db] = useState([]); // Lưu trữ ảnh đã chọn
    const [isUploading, setIsUploading] = useState(false); // Trạng thái upload ảnh
    const [fileUpload, setFileUpload] = useState("")
    const [fileUploadReplace, setFileUploadReplace] = useState("")
    const [resultsUploadFile,setResultsUploadFile]  = useState("")
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    
    const userID = localStorage.getItem("user_id");

    const handleOnChangeUploadFile = (event) => {
        if(event &&event.target && event.target.files && event.target.files.length>0){
            setFileUpload((prev) => {
                if(prev.length>0){
                    return [...prev, ...event.target.files]
                }
                return [...event.target.files]
            })
        }
    }
    
    const handleDeleteFileUpload = (nameFile) => {
        setFileUpload((prev) => {
            const newListFile = prev.filter((file) => file.name !== nameFile)
            return newListFile
        })
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
                setFileUpload("")
                setResultsUploadFile([...response.data.detected_items])
                setFileUploadReplace(fileUpload)
                message.success("Upload file success!")
            }
        } catch (error) {
            message.error("Upload file failt!")
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
    const [isLiked, setIsLiked] = useState(false); // Trạng thái yêu thích

    const toggleLike = () => {
        setIsLiked((prev) => !prev); // Đảo ngược trạng thái yêu thích khi nhấn vào nút
    };

    const [zoom, setZoom] = useState(1); // Kích thước ban đầu của ảnh

    const handleZoomIn = () => {
        setZoom(zoom + 0.1); // Phóng to ảnh khi nhấn vào nút zoom-in
    };

    const handleZoomOut = () => {
        setZoom(zoom - 0.1); // Thu nhỏ ảnh khi nhấn vào nút zoom-out
    };
     // Chuyển qua trang suggestion và truyền resultsUploadFile
     const handleGoToSuggestionPage = () => {
        navigate('/suggestion', { state: { ingredients: resultsUploadFile } });
    };

    return (
        <div className="p-8 flex flex-col gap-2">
            <h1 className="text-xl font-medium">Ảnh cần nhận diện</h1>
            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                {fileUpload && fileUpload.length>0 &&fileUpload.map((file, index) => {
                    return(
                    <div className="custom-box-upload-file relative group" key={index}>
                        <div className="rounded-full text-red-500 group-hover:opacity-100 opacity-0 right-2 top-2 absolute"
                        onClick={()=>handleDeleteFileUpload(file.name)}>
                            <MdDelete  size={25}/>
                        </div>
                        <img src={URL.createObjectURL(file)} alt="upload-image" className="w-[140px] h-fit"/>
                    </div>
                    )
                })
                    }
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
                    style={{width: "100px"}}
                    type="primary"
                    onClick={handleUpload}
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Thêm ảnh"}
                </Button>
            </div>
            <div className="flex gap-2">
            {fileUploadReplace.length > 0 && fileUploadReplace.map((file, index) => {
                return(
                    <div className="flex justify-center items-center flex-col">
                        <div className="custom-box-upload-file" key={index}>
                            <img
                            src={URL.createObjectURL(file)}
                            alt="upload-image"
                            className="w-[140px] h-fit"
                            style={{ transform: `scale(${zoom})` }} // Áp dụng tỷ lệ phóng đại
                            />
                        </div>
                        <div className="zoom-controls mt-2">
                            <button onClick={handleZoomIn} className="zoom-in-btn p-2 m-2 bg-red-500 text-white"><CiZoomIn /></button>
                            <button onClick={handleZoomOut} className="zoom-out-btn p-2 m-2 bg-red-500 text-white"><CiZoomOut /></button>
                        </div>
                    </div>
                )
            })}</div>
            <div className="flex gap-2">{resultsUploadFile.length>0 && 
            resultsUploadFile.map((result, index) => {
                return(
                <div className="w-[140px]" key={index}>
                    <p>{result}</p>
                </div>
                )
            })
           }</div>
           <div className="flex gap-2">
    
            {/* <div className="custom-box-upload-file" > */}
            <div>
            <Button type="primary" onClick={() => { 
                handleShowModal(); 
            }}>
                Gợi ý!
            </Button>
                    </div>

        {/* ------------------------Suggestion-------------------------- */}
       
            <Modal
                title="Ảnh"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)} // Đóng Modal
                footer={null}
            >
                
            </Modal>
            {/* -------------- */}
            </div>
           
        </div>

    );
};

export default Recognize;
