import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../css/FavouriteFood.css";
import { Modal } from "antd";
import imgdefault from '../img/bb.jpg';
import { FaHeart, FaTrash, FaInfoCircle } from 'react-icons/fa';

const FavouriteFood = () => {
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
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
            await axiosInstance.delete(`http://127.0.0.1:8000/favourite_food/delete/${user_id}/${food_id}`);
            setFoods((prevFoods) => prevFoods.filter((food) => food.food_id !== food_id));
        } catch (err) {
            console.error("Không thể xóa", err);
        }
    };
    
    const handleShowModal = (food) => {
        setSelectedFood(food);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedFood(null);
    };

    return (
        <div className="container">
            <h1 className="title">Món Ăn Yêu Thích <FaHeart className="titleIcon" /></h1>
            {foods.length === 0 ? (
                <p className="emptyMessage">Không có món ăn yêu thích nào được lưu.</p>
            ) : (
                <div className="foodGrid">
                    {foods.map((food, index) => (
                        <div key={index} className="foodCard">
                            <img
                                src={food.image || imgdefault}
                                alt={food.title}
                                className="foodImage"
                            />
                            <div className="foodInfo">
                                <h4 className="foodTitle">{food.title}</h4>
                                <div className="buttonGroup">
                                    <button className="detailButton" onClick={() => handleShowModal(food)}>
                                        <FaInfoCircle /> Chi tiết
                                    </button>
                                    <button className="deleteButton" onClick={() => deleteItem(food.food_id)}>
                                        <FaTrash /> Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                title={selectedFood && `Chi tiết món: ${selectedFood.title}`}
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
                bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
                className="customModal"
            >
                {selectedFood && (
                    <div className="foodDetails">
                        <img src={selectedFood.image || imgdefault} alt={selectedFood.title} className="modalImage" />
                        <div className="modalContent">
                            <h2>{selectedFood.title}</h2>
                            <h3>Mô tả:</h3>
                            <p dangerouslySetInnerHTML={{ __html: selectedFood.description || "Không có mô tả." }} />
                            <h3>Nguyên liệu:</h3>
                            <ul>
                                {selectedFood.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                            <h3>Hướng dẫn:</h3>
                            <p dangerouslySetInnerHTML={{ __html: selectedFood.instructions || "Không có hướng dẫn." }} />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default FavouriteFood;
