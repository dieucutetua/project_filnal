import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import '../css/FavouriteFood.css'

const FavouriteFood = () => {
    console.log("yeu thich");  // Kiểm tra user_id
    const [foods, setFoods] = useState([]);
    const user_id = localStorage.getItem("user_id");
    const email = localStorage.getItem("email");
   
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await axiosInstance.get(`/food_items/foods/${user_id}`);
                setFoods(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách món ăn:", error);
            }
        };
        fetchFoods();
    }, [user_id]);

    return (
        <div>
            <h3>Danh sách yêu thích của người dùng: {email}</h3>
            <div className="food-list">
                {foods.map((food, index) => (
                    <div key={index} className="food-item">
                        <h4><strong>Tên món:</strong> {food.name}</h4>
                        <p><strong>Mô tả:</strong> {food.description}</p>
                        <p><strong>Nguyên liệu:</strong> {food.ingredients.join(", ")}</p>
                        <p><strong>Cách thực hiện:</strong> {food.steps}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavouriteFood;
