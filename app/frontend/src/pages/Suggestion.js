import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import imgdefault from '../img/bb.jpg';
import { FaBackward ,FaHeart} from "react-icons/fa";


const Suggestion = () => {
    const location = useLocation();
    const [dishes, setDishes] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [error, setError] = useState(null); 
    const [selectedDish, setSelectedDish] = useState(null); 
    const user_id = localStorage.getItem("user_id");

    const searchParams = new URLSearchParams(location.search);
    const ingredients = JSON.parse(searchParams.get("ingredients") || "[]");

    const hasFetched = useRef(false); 

    useEffect(() => {
        if (ingredients.length > 0 && !hasFetched.current) {
            fetchSuggestions();
            hasFetched.current = true;  
        }
    }, [ingredients]);  

    const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post("/search/find_recipes", null, {
                params: {
                    input_ingredients: ingredients.join(",")  
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
    const saveFavourite = async (dish) => {
        setSaving(true);
        setSaveError(null);
        try {
            const response = await axiosInstance.post("/favourite_food/favourite", {
                
                user_id: user_id, // Thay bằng ID người dùng hiện tại
                name: dish.title,
                source: dish.source || "N/A",
                preptime: dish.preptime || 0,
                waittime: dish.waittime || 0,
                cooktime: dish.cooktime || 0,
                servings: dish.servings || 1,
                comments: "",
                calories: dish.calories || 0,
                fat: dish.fat || 0,
                satfat: dish.satfat || 0,
                carbs: dish.carbs || 0,
                fiber: dish.fiber || 0,
                sugar: dish.sugar || 0,
                protein: dish.protein || 0,
                instructions: dish.steps || "N/A",
                ingredients: dish.ingredients || [],
                tags: dish.tags || []
            });
            alert("Lưu món ăn thành công!");
        } catch (err) {
            console.error("Error saving favourite dish:", err);
            setSaveError("Không thể lưu món ăn yêu thích. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    const handleDishClick = (dish) => {
        setSelectedDish(dish); 
    };

    const handleBack = () => {
        setSelectedDish(null);  
    };

    return (
        <div className="p-8">
            {selectedDish ? (
        
                <div>
                    
                    <button onClick={handleBack} className="text-blue-500 mb-4"><FaBackward className="icon"/>Quay lại</button>
                     <button
                        onClick={() => saveFavourite(selectedDish)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                        disabled={saving}
                    >
                        <FaHeart className="mr-2" />
                        {saving ? "Đang lưu..." : "Lưu yêu thích"}
                        </button>
                    <h1 className="text-2xl font-bold mb-4">{selectedDish.title}</h1>
                    <img
                        src={selectedDish.image_url ||imgdefault}
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
                                    onClick={() => handleDishClick(dish)} 
                                >
                                    <img
                                        src={dish.image_url || imgdefault}
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
