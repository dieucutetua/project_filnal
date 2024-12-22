import os
from fastapi import APIRouter, HTTPException
from database import recipes_collection  # Đảm bảo đã kết nối MongoDB đúng
from typing import List
from deep_translator import GoogleTranslator

router = APIRouter()

# Hàm tìm kiếm món ăn theo nguyên liệu
async def find_recipes_by_ingredients(input_ingredients: List[str]):
    # Tìm kiếm món ăn trực tiếp trong MongoDB (nếu có thể)
    recipes_cursor = recipes_collection.find({"nor_ingredients": {"$in": input_ingredients}})
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

# Hàm dịch nguyên liệu từ tiếng Việt sang tiếng Anh
async def detect_and_translate_to_english(ingredients: list) -> list:
    translated_ingredients = []
    for ingredient in ingredients:
        try:
            translated = GoogleTranslator(source="auto", target="en").translate(ingredient)
            translated_ingredients.append(translated)
        except Exception as e:
            print(f"Error translating {ingredient}: {e}")
            translated_ingredients.append(ingredient)  # Nếu dịch lỗi, giữ nguyên nguyên liệu
    return translated_ingredients

@router.post("/find_recipes")
async def get_recipes(input_ingredients: str):
    if not input_ingredients:
        raise HTTPException(status_code=400, detail="Nguyên liệu không thể trống.")

    # Tách và loại bỏ khoảng trắng
    input_ingredients_list = [ingredient.strip() for ingredient in input_ingredients.split(",")]

    # Dịch sang tiếng Anh nếu cần
    input_ingredients_list = await detect_and_translate_to_english(input_ingredients_list)

    # Tìm kiếm công thức món ăn
    recipes = await find_recipes_by_ingredients(input_ingredients_list)
    if not recipes:
        raise HTTPException(status_code=404, detail="Không tìm thấy món ăn phù hợp.")
    
    return {"recipes": recipes}
