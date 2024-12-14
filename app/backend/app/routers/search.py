import os
from fastapi import APIRouter, HTTPException
from database import recipes_collection  # Đảm bảo đã kết nối MongoDB đúng
from typing import List
from models.modelRecipes import Recipes  # Sử dụng model để format dữ liệu

from pathlib import Path

router = APIRouter()

# Hàm tìm kiếm món ăn theo nguyên liệu
async def find_recipes_by_ingredients(input_ingredients: List[str]):
    recipes_cursor = recipes_collection.find()  # Lấy tất cả món ăn từ MongoDB

    # Chuyển kết quả thành một danh sách đồng bộ
    recipes = await recipes_cursor.to_list(length=None)  # Chuyển con trỏ thành danh sách

    results = []
    for recipe in recipes:
        # Kiểm tra các nguyên liệu trùng
        matched = set(input_ingredients) & set(recipe["ingredients"])
        match_percentage = len(matched) / len(recipe["ingredients"]) * 100 if recipe["ingredients"] else 0
        
        results.append({
            "title": recipe.get("name", ""),  # Đảm bảo trường đúng
            "match_percentage": match_percentage,
            "matched_ingredients": list(matched),
            "missing_ingredients": list(set(recipe["ingredients"]) - matched),
            "steps": recipe.get("instructions", ""),  # Đảm bảo trường đúng
        })

    # Sắp xếp kết quả theo phần trăm trùng khớp giảm dần
    results = sorted(results, key=lambda x: x["match_percentage"], reverse=True)
    return results

# API tìm kiếm món ăn theo nguyên liệu
@router.post("/find_recipes")
async def get_recipes(input_ingredients: List[str]):
    if not input_ingredients:
        raise HTTPException(status_code=400, detail="Nguyên liệu không thể trống.")
    
    # Sử dụng await để gọi hàm bất đồng bộ
    recipes = await find_recipes_by_ingredients(input_ingredients)
    
    if not recipes:
        raise HTTPException(status_code=404, detail="Không tìm thấy món ăn phù hợp.")
    
    return {"recipes": recipes}
