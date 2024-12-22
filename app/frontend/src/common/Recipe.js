import React from 'react';
import { useLocation } from 'react-router-dom';

const Recipe = () => {
  const location = useLocation();
  const { ingredients } = location.state || { ingredients: [] };

  return (
    <div>
      <h2>Gợi ý món ăn</h2>
      <h4><strong>Nguyên liệu:</strong></h4>
      <ul>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))
        ) : (
          <p>Không có nguyên liệu nào.</p>
        )}
      </ul>
      <p><strong>Mô tả:</strong> Đây là nơi mô tả món ăn.</p>
      <p><strong>Cách thực hiện:</strong> Hướng dẫn thực hiện món ăn.</p>
    </div>
  );
};

export default Recipe;