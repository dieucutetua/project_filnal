import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../css/FavouriteFood.css";
import { Modal } from "antd";
import imgdefault from '../img/bb.jpg';

const FavouriteFood = () => {
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null); // Món ăn được chọn
    const [isModalVisible, setIsModalVisible] = useState(false);
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await axiosInstance.get(`/favourite_food/favourite/${user_id}`);
                console.log("Dữ liệu món ăn nhận được:", response.data);
                setFoods(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách món ăn:", error);
            }
        };
        fetchFoods();
    }, [user_id]);

    const deleteItem = async (food_id) => {
        try {
            console.log("User ID:", user_id);        // In ra user_id
            console.log("Food ID:", food_id);        // In ra food_id
            const response = await axiosInstance.delete( 
                `http://127.0.0.1:8000/favourite_food/delete/${user_id}/${food_id}`
            );
            setFoods((prevFoods) => prevFoods.filter((food) => food.food_id !== food_id));
            
            
        } catch (err) {
            console.error("Không thể xóa", err);
        }
    };
    
    const handleShowModal = (food) => {
        setSelectedFood(food); // Lưu món ăn được chọn
        setIsModalVisible(true); // Hiển thị Modal
    };

    const handleCloseModal = () => {
        setIsModalVisible(false); // Ẩn Modal
        setSelectedFood(null); // Xóa dữ liệu món ăn được chọn
    };

    return (
        <div>
            <div className="food-list">
                {foods.length === 0 ? (
                    <p>Không có món ăn yêu thích nào được lưu.</p>
                ) : (
                    foods.map((food, index) => (
                        <div key={index} className="food-item">
                            <h4>{food.title}</h4>
                            <img
                                src={ food.image|| imgdefault}
                                className="w-32 h-32 object-cover rounded-md mb-2"
                            />
                            <button className="select-button" onClick={() => handleShowModal(food)}>Xem chi tiết</button>
                            <button className="delete-button" onClick={() => deleteItem(food.food_id)}>Xóa món ăn</button>
                        </div>
                    ))
                )}
            </div>

            {/* Modal hiển thị chi tiết */}
            {selectedFood && (
                <Modal
                    title={`Chi tiết món: ${selectedFood.title}`}
                    visible={isModalVisible}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={800} // Tăng chiều rộng Modal
                    bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                    <div className="food-details">
                        <p><strong>Tên món:</strong> {selectedFood.title}</p>
                        <p><strong>Mô tả:</strong> {selectedFood.description || "Không có mô tả."}</p>
                        <p><strong>Nguyên liệu:</strong> {selectedFood.ingredients.join(", ")}</p>
                        <p><strong>Hướng dẫn:</strong> {selectedFood.instructions || "Không có hướng dẫn."}</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default FavouriteFood;
