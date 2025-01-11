import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import imgdefault from "../img/bb.jpg";
import { FaBackward, FaHeart } from "react-icons/fa";
import { message } from "antd";
import SidebarGuest from "../components/SidebarGuest";
import Header from "../components/Header";

const GuestPage = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomDishes, setRandomDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const user_id = localStorage.getItem("user_id");

  const getAllDishes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/search/get_all_recipes");
      if (response.data && response.data.recipes) {
        setDishes(response.data.recipes);
        const randomDishes = getRandomDishes(response.data.recipes, 10);
        setRandomDishes(randomDishes);
      } else {
        setDishes([]);
        setError("Không có món ăn nào.");
      }
    } catch (err) {
      console.error("Error fetching dishes:", err);
      setError("Không thể tải danh sách món ăn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm chọn món ăn ngẫu nhiên
  const getRandomDishes = (dishes, n) => {
    const randomDishes = [];
    while (randomDishes.length < n) {
      const randomIndex = Math.floor(Math.random() * dishes.length);
      const randomDish = dishes[randomIndex];
      if (!randomDishes.includes(randomDish)) {
        randomDishes.push(randomDish);
      }
    }
    return randomDishes;
  };

  // Hàm lưu món ăn yêu thích
  const saveFavourite = async (dish) => {
    if (!user_id) {
      message.warning("Vui lòng đăng nhập để lưu món ăn yêu thích.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const response = await axiosInstance.post("/user/save_favourite", {
        user_id,
        dish_id: dish.id,
      });

      if (response.data.success) {
        message.success("Món ăn đã được lưu vào yêu thích!");
      } else {
        setSaveError("Không thể lưu món ăn. Vui lòng thử lại sau.");
      }
    } catch (err) {
      setSaveError("Không thể lưu món ăn. Vui lòng thử lại sau.");
      console.error("Error saving favourite:", err);
    } finally {
      setSaving(false);
    }
  };

  // Gọi API khi component mount
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
    <div className="flex">
      <div className="sidebar top-0 left-0 sticky h-full">
        <SidebarGuest isGuest={true} />
      </div>
      <div className="w-full h-full">
        <Header />
        <div className="p-8 w-full overflow-auto">
          {selectedDish ? (
            <div>
              <button onClick={handleBack} className="text-blue-500 mb-4">
                <FaBackward className="icon" /> Quay lại
              </button>
              <button
                onClick={() => saveFavourite(selectedDish)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                disabled={saving}
              >
                <FaHeart className="mr-2" />
                {saving ? "Đang lưu..." : "Lưu yêu thích"}
              </button>
              {saveError && <p className="text-red-500">{saveError}</p>}
              <h1 className="text-2xl font-bold mb-4">{selectedDish.title}</h1>
              <img
                src={selectedDish.image_url || imgdefault}
                alt={selectedDish.title}
                className="w-full h-72 object-contain rounded-md mb-4"
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
                    {selectedDish.steps
                      .split("\r\n")
                      .filter((step) => step.trim() !== "")
                      .map((step, idx) => (
                        <li key={idx} className="ml-4">
                          {step}
                        </li>
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
                    <div
                      key={index}
                      className="p-4 col-span-1 bg-white shadow rounded-lg flex flex-col items-center"
                    >
                      <li
                        key={index}
                        className="p-4 bg-white shadow rounded-lg flex flex-col items-center h-full w-full"
                        onClick={() => handleDishClick(dish)}
                      >
                        <img
                          src={dish.image_url || imgdefault}
                          alt={dish.title}
                          className="w-32 h-32 object-contain rounded-md mb-2"
                        />
                        <h2 className="text-lg font-medium text-center">
                          {dish.title}
                        </h2>
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
                <p className="text-lg text-gray-500">
                  Không có món ăn nào phù hợp.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestPage;
