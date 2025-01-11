import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import imgdefault from "../img/bb.jpg";
import { FaBackward, FaHeart } from "react-icons/fa";

const Home = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomDishes, setRandomDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [likedDishes, setLikedDishes] = useState(new Set());
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
  const saveFavourite = async (dish) => {
    setSaving(true);
    setSaveError(null);
    try {
      const response = await axiosInstance.post("/favourite_food/favourite", {
        user_id: user_id,
        food_id: dish.id || "N/A",
        title: dish.title || "N/A",
        recipe_url: dish.recipe_url || "N/A",
        description: dish.description || "N/A",
        image: dish.image || "N/A",
        instructions: dish.instructions || "N/A",
        steps: dish.steps || "N/A",
        ingredients: dish.ingredients || [],
      });
      alert("Lưu món ăn thành công!");
      setLikedDishes((prevLiked) => new Set(prevLiked.add(dish.id)));
    } catch (err) {
      console.error("Error saving favourite dish:", err);
      if (err.response) {
        console.error("Response error data:", err.response.data);
        console.error("Response error status:", err.response.status);
      } else {
        console.error("Network error or unexpected error:", err.message);
      }
      setSaveError("Không thể lưu món ăn yêu thích. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };
  const removeFavourite = async (dish) => {
    try {
      console.log("User ID:", user_id);

      console.log("Food ID:", dish.id);
      const response = await axiosInstance.delete(
        `http://127.0.0.1:8000/favourite_food/delete/${user_id}/${dish.id}`
      );
      alert("Hủy yêu thích thành công!");
      setLikedDishes((prevLiked) => {
        const newLiked = new Set(prevLiked);
        newLiked.delete(dish.id);
        return newLiked;
      });
    } catch (err) {
      console.error("Không thể xóa", err);
    }
  };
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
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBack}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <FaBackward className="icon inline-block" />
              Quay lại
            </button>

            <button
              onClick={() =>
                likedDishes.has(selectedDish.id)
                  ? removeFavourite(selectedDish)
                  : saveFavourite(selectedDish)
              }
              className={`${
                likedDishes.has(selectedDish.id)
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50`}
              disabled={saving}
            >
              <FaHeart className="mr-2" />
              {saving
                ? "Đang lưu..."
                : likedDishes.has(selectedDish.id)
                ? "Đã yêu thích"
                : "Lưu yêu thích"}
            </button>
          </div>

          <h1 className="text-4xl font-semibold text-gray-800 mt-6">
            {selectedDish.title}
          </h1>

          <img
            src={selectedDish.image || imgdefault}
            alt={selectedDish.title}
            className="w-64 h-auto object-contain rounded-lg mt-4 mb-6 mx-auto"
          />

          <p
            dangerouslySetInnerHTML={{
              __html: selectedDish.description || "Không có mô tả chi tiết.",
            }}
            className="text-lg text-gray-700 mb-6"
          />

          <h3 className="text-2xl font-medium text-gray-800 mt-6">
            Nguyên liệu:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
            {selectedDish.ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient}</li>
            ))}
          </ul>

          {selectedDish.steps && (
            <div>
              <h3 className="text-2xl font-medium text-gray-800 mt-6">
                Các bước:
              </h3>
              <ol className="list-decimal pl-6 space-y-2 text-lg text-gray-700">
                {selectedDish.steps
                  .split("\r\n")
                  .filter((step) => step.trim() !== "")
                  .map((step, idx) => (
                    <li
                      key={idx}
                      className="ml-4"
                      dangerouslySetInnerHTML={{ __html: step }}
                    />
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
                      src={dish.image || imgdefault}
                      alt={dish.title}
                      className="w-32 h-32 object-contain rounded-md mb-2"
                    />
                    <h2 className="text-lg font-medium text-center">
                      {dish.title}
                    </h2>
                    {/* <p className="text-sm text-gray-600 text-center">
                                    {dish.description || "Không có mô tả chi tiết."}
                                </p> */}
                    <ul className="text-sm mt-2 text-gray-800 max-h-40 overflow-y-auto">
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
  );
};

export default Home;
