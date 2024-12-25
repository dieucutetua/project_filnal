import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";  // Đảm bảo rằng axiosInstance đã được cấu hình đúng

const Home = () => {
    const [dishes, setDishes] = useState([]); // Lưu trữ danh sách món ăn
    const [loading, setLoading] = useState(false); // Biến trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Biến trạng thái lỗi
    const [randomDishes, setRandomDishes] = useState([]); // Món ăn ngẫu nhiên

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

    // Gọi API khi component được mount
    useEffect(() => {
        getAllDishes();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Món ăn ngẫu nhiên</h1>

            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && randomDishes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {randomDishes.map((dish, index) => (
                        <div key={index} className="p-4 bg-white shadow rounded-lg flex flex-col items-center">
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
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && randomDishes.length === 0 && (
                <p className="text-lg text-gray-500">Không có món ăn nào phù hợp.</p>
            )}
        </div>
    );
};

export default Home;
