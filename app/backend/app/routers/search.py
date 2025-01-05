import os
from fastapi import APIRouter, HTTPException
from database import recipes_collection  # Đảm bảo đã kết nối MongoDB đúng
from typing import List
from deep_translator import GoogleTranslator

router = APIRouter()

# Hàm tìm kiếm công thức theo nguyên liệu
async def find_recipes_by_ingredients(input_ingredients: List[str]):
    recipes_cursor = recipes_collection.find({"nor_ingredients": {"$in": input_ingredients}})
    recipes = await recipes_cursor.to_list(length=None)
    
    if not recipes:
        raise HTTPException(status_code=404, detail="Không tìm thấy công thức phù hợp với nguyên liệu.")
    
    results = []
    for recipe in recipes:
        matched = set(input_ingredients) & set(recipe["nor_ingredients"])
        match_percentage = len(matched) / len(recipe["nor_ingredients"]) * 100 if recipe["nor_ingredients"] else 0
        if matched:
            results.append({
                "id": str(recipe.get("_id","")),
                "title": recipe.get("title", ""),
                "match_percentage": match_percentage,
                "matched_ingredients": list(matched),
                "image": recipe.get("image",""),
                "description":recipe.get("description",""),
                "instructions" : recipe.get("instructions",""),
                "recipe_url":recipe.get("recipe_url",""),
                "ingredients": list(set(recipe.get("ingredients", []))),
                "steps": recipe.get("instructions", ""),
                })
    
    results = sorted(results, key=lambda x: x["match_percentage"], reverse=True)
    return results[:5]

# Hàm dịch và chuyển sang tiếng Anh
async def detect_and_translate_to_english(ingredients: list) -> list:
    translated_ingredients = []
    for ingredient in ingredients:
        # Kiểm tra nếu nguyên liệu đã là tiếng Anh
        if ingredient.isascii():
            translated_ingredients.append(ingredient)
        else:
            try:
                translated = GoogleTranslator(source="auto", target="en").translate(ingredient)
                translated_ingredients.append(translated)
            except Exception as e:
                print(f"Error translating {ingredient}: {e}")
                translated_ingredients.append(ingredient) 
    return translated_ingredients

# Endpoint tìm kiếm công thức theo nguyên liệu
@router.post("/find_recipes")
async def get_recipes(input_ingredients: str):
    if not input_ingredients:
        raise HTTPException(status_code=400, detail="Nguyên liệu không thể trống.")

    # Chuyển nguyên liệu nhập vào thành danh sách và dịch sang tiếng Anh nếu cần
    input_ingredients_list = [ingredient.strip() for ingredient in input_ingredients.split(",")]
    input_ingredients_list = await detect_and_translate_to_english(input_ingredients_list)

    # Tìm kiếm công thức với các nguyên liệu đã dịch
    recipes = await find_recipes_by_ingredients(input_ingredients_list)
    if not recipes:
        raise HTTPException(status_code=404, detail="Không tìm thấy món ăn phù hợp.")
    
    return {"recipes": recipes}

# Hàm lấy tất cả các công thức món ăn
async def get_all_recipes():
    recipes_cursor = recipes_collection.find()
    recipes = await recipes_cursor.to_list(length=None)

    results = []
    for recipe in recipes:
        results.append({
            "id": str(recipe.get("_id","")),
            "title": recipe.get("title", ""),
            "image": recipe.get("image",""),
            "description":recipe.get("description",""),
            "instructions" : recipe.get("instructions",""),
            "recipe_url":recipe.get("recipe_url",""),
            "ingredients": list(set(recipe.get("ingredients", []))),
            "steps": recipe.get("instructions", ""),
        })

    return results

# Endpoint để lấy tất cả công thức món ăn
@router.get("/get_all_recipes")
async def get_all():
    recipes = await get_all_recipes()
    if not recipes:
        raise HTTPException(status_code=404, detail="Không tìm thấy công thức món ăn.")
    
    return {"recipes": recipes}
