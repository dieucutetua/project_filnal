import React, { useState } from "react";
import axios from "axios";

const Recognize = () => {
    const user_id = localStorage.getItem('user_id');
    const [images, setImages] = useState([]); // Lưu trữ ảnh đã chọn
    const [message, setMessage] = useState(""); // Thông báo kết quả upload
    const [isUploading, setIsUploading] = useState(false); // Trạng thái upload ảnh
    const [uploadedFiles, setUploadedFiles] = useState([]); // Lưu trữ tên file đã upload

    // Hàm xử lý thay đổi khi người dùng chọn file ảnh
    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImages(files); // Lưu trữ nhiều ảnh (nếu có)
        }
    };

    // Hàm gửi ảnh lên API
    const handleUpload = async () => {
        if (images.length === 0) {
            setMessage("Please select images first.");
            return;
        }

        // Tạo FormData để gửi ảnh
        const formData = new FormData();
        Array.from(images).forEach((image) => {
            formData.append("files", image); // Gửi mỗi ảnh vào FormData
        });
        // Thêm user_id vào FormData
        const user_id = localStorage.getItem("user_id");
        if (user_id) {
            formData.append("user_id", user_id);
        } else {
            setMessage("User ID is missing.");
            return;
        }

        setIsUploading(true); // Bắt đầu quá trình tải lên

        try {
            const response = await axios.post("http://127.0.0.1:8000/food/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Đảm bảo gửi dữ liệu dưới dạng form-data
                },
            });

            // Xử lý khi upload thành công
            setMessage(response.data.info || "Files uploaded successfully!");
            setUploadedFiles(response.data.file_names || []); // Lưu trữ tên các file đã upload
            console.log("Upload successful:", response.data);

            if (response.data.file_names) {
                localStorage.setItem("file_names", response.data.file_names); // Lưu user_id
            }
        } catch (error) {
            // Xử lý khi upload thất bại
            setMessage("Image upload failed. Please try again.");
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false); // Kết thúc quá trình tải lên
        }
    };

    return (
        <div>
            <h1>Upload Images</h1>
            <div>
                <input
                    type="file"
                    accept="image/*" // Chỉ cho phép chọn ảnh
                    onChange={handleImageChange} // Gọi hàm khi người dùng chọn ảnh
                    multiple // Cho phép chọn nhiều ảnh
                />
                <button
                    onClick={handleUpload}
                    disabled={isUploading} // Disable nút khi đang upload
                >
                    {isUploading ? "Uploading..." : "Upload"}
                </button>
            </div>
            {message && <p>{message}</p>} {/* Hiển thị thông báo */}



        </div>

    );
};

export default Recognize;
