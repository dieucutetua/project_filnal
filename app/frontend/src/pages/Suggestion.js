import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../css/FavouriteFood.css";

const Suggestion = () => {

    const [foods, setFoods] = useState([]); // Kết quả món ăn
    const [inputIngredients, setInputIngredients] = useState(""); // Input nguyên liệu
    const user_id = localStorage.getItem("user_id");
    const email = localStorage.getItem("email");

    // Fetch dữ liệu khi inputIngredients thay đổi
    useEffect(() => {
        const fetchFoods = async () => {
            if (!inputIngredients) return; // Không tìm nếu input rỗng
            try {
                const response = await axiosInstance.get(
                    `/search/find_recipes?input_ingredients=${inputIngredients}`
                );
                setFoods(response.data.recipes); // Đảm bảo API trả về đúng key
            } catch (error) {
                console.error("Lỗi khi lấy danh sách món ăn:", error);
            }
        };

        fetchFoods();
    }, [inputIngredients]);

    return (
        <div>

            {/* Input nhập nguyên liệu */}
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Nhập nguyên liệu, ví dụ: egg, butter"
                    value={inputIngredients}
                    onChange={(e) => setInputIngredients(e.target.value)}
                    className="input-field"
                />
            </div>

            {/* Hiển thị danh sách món ăn */}
            <div className="food-list">
                {foods.length > 0 ? (
                    foods.map((food, index) => (
                        <div key={index} className="food-item">
                            <h4><strong>Tên món:</strong> {food.title}</h4>
                            <p><strong>Phần trăm phù hợp:</strong> {food.match_percentage}%</p>
                            <p><strong>Nguyên liệu trùng khớp:</strong> {food.matched_ingredients.join(", ")}</p>
                            <p><strong>Nguyên liệu đầy đủ:</strong> {food.ingredients.join(", ")}</p>
                            <p><strong>Cách thực hiện:</strong></p>
                            <pre>{food.steps}</pre>
                        </div>
                    ))
                ) : (
                    <p>Không tìm thấy món ăn nào.</p>
                )}
            </div>
        </div>
    );
};

export default Suggestion;
