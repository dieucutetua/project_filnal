import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; 
import imgdefault from '../img/bb.jpg';
import { FaBackward,FaHeart  } from "react-icons/fa";


const Home = () => {
    const [dishes, setDishes] = useState([]); // Lưu trữ danh sách món ăn
    const [loading, setLoading] = useState(false); // Biến trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Biến trạng thái lỗi
    const [randomDishes, setRandomDishes] = useState([]); // Món ăn ngẫu nhiên
    const [selectedDish, setSelectedDish] = useState(null); 
    const [saving, setSaving] = useState(false); // Trạng thái lưu yêu thích
    const [saveError, setSaveError] = useState(null);
    const user_id = localStorage.getItem("user_id")
    // Hàm để gọi API và lấy tất cả món ăn
    const getAllDishes = async () => {
        setLoading(true);
        setError(null); // Xoá lỗi trước khi bắt đầu gọi API
        try {
            const response = await axiosInstance.get("/search/get_all_recipes"); // Thay "/search/getall" bằng đường dẫn API tương ứng của bạn
            if (response.data && response.data.recipes) {
                setDishes(response.data.recipes);  // Lưu danh sách món ăn vào state
                // Chọn 3 món ăn ngẫu nhiên từ danh sách món ăn
                const randomDishes = getRandomDishes(response.data.recipes, 10);
                setRandomDishes(randomDishes); // Lưu các món ăn ngẫu nhiên
            } else {
                setDishes([]);
                setError("Không có món ăn nào.");
            }
        } catch (err) {
            console.error("Error fetching dishes:", err);
            setError("Không thể tải danh sách món ăn. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);  // Đảm bảo trạng thái tải được tắt khi đã nhận được dữ liệu
        }
    };

    // Hàm để chọn ra n món ăn ngẫu nhiên
    const getRandomDishes = (dishes, n) => {
        const randomDishes = [];
        while (randomDishes.length < n) {
            const randomIndex = Math.floor(Math.random() * dishes.length);
            const randomDish = dishes[randomIndex];
            if (!randomDishes.includes(randomDish)) { // Đảm bảo không trùng món ăn
                randomDishes.push(randomDish);
            }
        }
        return randomDishes;
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
    // Gọi API khi component được mount
    useEffect(() => {
        getAllDishes();
    }, []);
    const handleDishClick = (dish) => {
        setSelectedDish(dish); 
    };

    const handleBack = () => {
        setSelectedDish(null);  
    };
    return (
        <div className="p-8 w-full overflow-auto">
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
                src={selectedDish.image_url || imgdefault}
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
            <h1 className="text-2xl font-bold mb-4">Món ăn ngẫu nhiên</h1>

            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && randomDishes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {randomDishes.map((dish, index) => (
                        <div key={index} className="p-4 col-span-1 bg-white shadow rounded-lg flex flex-col items-center">
                            <li
                                    key={index}
                                    className="p-4 bg-white shadow rounded-lg flex flex-col items-center h-full w-full"
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
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && randomDishes.length === 0 && (
                <p className="text-lg text-gray-500">Không có món ăn nào phù hợp.</p>
            )}
            </>
    )}
        </div>
    );
};

export default Home;
