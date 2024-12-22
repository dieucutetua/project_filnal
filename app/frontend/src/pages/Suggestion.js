import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Suggestion = () => {
    const location = useLocation();
    const [dishes, setDishes] = useState([]); // Lưu danh sách món ăn
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [selectedDish, setSelectedDish] = useState(null); // Lưu món ăn được chọn

    const searchParams = new URLSearchParams(location.search);
    const ingredients = JSON.parse(searchParams.get("ingredients") || "[]");

    const hasFetched = useRef(false);  // Sử dụng useRef để tránh gọi lại khi ingredients không thay đổi

    useEffect(() => {
        if (ingredients.length > 0 && !hasFetched.current) {
            fetchSuggestions();
            hasFetched.current = true;  // Đánh dấu rằng đã fetch xong
        }
    }, [ingredients]);  // Không gọi lại nếu ingredients không thay đổi

    const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post("/search/find_recipes", null, {
                params: {
                    input_ingredients: ingredients.join(",")  // Gửi nguyên liệu dưới dạng chuỗi trong tham số truy vấn
                }
            });

            if (response.data && response.data.recipes) {
                setDishes(response.data.recipes);
            } else {
                setDishes([]);
                setError("Không có dữ liệu hợp lệ từ API.");
            }
        } catch (err) {
            console.error("Error fetching suggestions:", err);
            setError("Không thể tải danh sách món ăn. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const handleDishClick = (dish) => {
        setSelectedDish(dish);  // Lưu món ăn đã chọn vào state
    };

    const handleBack = () => {
        setSelectedDish(null);  // Quay lại danh sách món ăn
    };

    return (
        <div className="p-8">
            {selectedDish ? (
                // Hiển thị chi tiết món ăn khi đã chọn
                <div>
                    <button onClick={handleBack} className="text-blue-500 mb-4">Quay lại</button>
                    <h1 className="text-2xl font-bold mb-4">{selectedDish.title}</h1>
                    <img
                        src={selectedDish.image_url || "/default-dish.jpg"}
                        alt={selectedDish.title}
                        className="w-full h-72 object-cover rounded-md mb-4"
                    />
                    <p>{selectedDish.description || "Không có mô tả chi tiết."}</p>
                    <h3 className="font-medium mt-4">Nguyên liệu:</h3>
                    <ul className="list-disc pl-6">
                        {selectedDish.ingredients.map((ingredient, idx) => (
                            <li key={idx}>{ingredient}</li>
                        ))}
                    </ul>

                    {/* Hiển thị các bước nếu có */}
                    {selectedDish.steps && (
                        <div>
                            <h3 className="font-medium mt-4">Các bước:</h3>
                            <ol className="list-decimal pl-6">
                                {selectedDish.steps.split("\r\n").filter(step => step.trim() !== "").map((step, idx) => (
                                    <li key={idx} className="ml-4">{step}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            ) : (
                // Hiển thị danh sách món ăn khi chưa chọn món
                <>
                    <h1 className="text-2xl font-bold mb-4">Danh sách món ăn gợi ý</h1>
                    {loading && <p>Đang tải dữ liệu...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && dishes.length === 0 && (
                        <p className="text-lg text-gray-500">Không tìm thấy món ăn nào phù hợp.</p>
                    )}
                    {!loading && dishes.length > 0 && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {dishes.map((dish, index) => (
                                <li
                                    key={index}
                                    className="p-4 bg-white shadow rounded-lg flex flex-col items-center"
                                    onClick={() => handleDishClick(dish)}  // Gọi handleDishClick khi nhấn vào món ăn
                                >
                                    <img
                                        src={dish.image_url || "/default-dish.jpg"}
                                        alt={dish.title}
                                        className="w-32 h-32 object-cover rounded-md mb-2"
                                    />
                                    <h2 className="text-lg font-medium text-center">{dish.title}</h2>
                                    <p className="text-sm text-gray-600 text-center">
                                        {dish.description || "Không có mô tả chi tiết."}
                                    </p>
                                    <ul className="text-sm mt-2 text-gray-800">
                                        <h3 className="font-medium">Nguyên liệu:</h3>
                                        {dish.ingredients.map((ingredient, idx) => (
                                            <li key={idx} className="list-disc ml-4">
                                                {ingredient}
                                            </li>
                                        ))}
                                    </ul>
                                    {/* Không hiển thị steps khi chưa chọn món ăn */}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default Suggestion;
