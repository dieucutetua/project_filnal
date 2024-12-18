import os
from fastapi import APIRouter, HTTPException
from database import recipes_collection  # Đảm bảo đã kết nối MongoDB đúng
from typing import List
from models.modelRecipes import Recipes  # Sử dụng model để format dữ liệu

from pathlib import Path

router = APIRouter()

# Hàm tìm kiếm món ăn theo nguyên liệu
async def find_recipes_by_ingredients(input_ingredients: List[str]):
    recipes_cursor = recipes_collection.find()  

    recipes = await recipes_cursor.to_list(length=None) 

    results = []
    for recipe in recipes:
        matched = set(input_ingredients) & set(recipe["nor_ingredients"])
        match_percentage = len(matched) / len(recipe["nor_ingredients"]) * 100 if recipe["nor_ingredients"] else 0
        if matched:
            results.append({
                "title": recipe.get("name", ""), 
                "match_percentage": match_percentage,
                "matched_ingredients": list(matched),           
                "ingredients": list(set(recipe["ingredients"])),
                "steps": recipe.get("instructions", ""),  
            })
    results = sorted(results, key=lambda x: x["match_percentage"], reverse=True)
    return results[:5]

@router.post("/find_recipes")
async def get_recipes(input_ingredients: str):
    if not input_ingredients:
        raise HTTPException(status_code=400, detail="Nguyên liệu không thể trống.")

    input_ingredients_list = [ingredient.strip() for ingredient in input_ingredients.split(",")]

    recipes = await find_recipes_by_ingredients(input_ingredients_list)
    if not recipes:
        raise HTTPException(status_code=404, detail="Không tìm thấy món ăn phù hợp.")
    
    return {"recipes": recipes}