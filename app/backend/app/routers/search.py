import os
from fastapi import APIRouter, HTTPException
from database import recipes_collection 
from typing import List
from deep_translator import GoogleTranslator
from cruds.search import find_recipes_by_ingredients,get_all_recipes

router = APIRouter()



# async def detect_and_translate_to_english(ingredients: list) -> list:
#     translated_ingredients = []
#     for ingredient in ingredients:

#         if ingredient.isascii():
#             translated_ingredients.append(ingredient)
#         else:
#             try:
#                 translated = GoogleTranslator(source="auto", target="en").translate(ingredient)
#                 translated_ingredients.append(translated)
#             except Exception as e:
#                 print(f"Error translating {ingredient}: {e}")
#                 translated_ingredients.append(ingredient) 
#     return translated_ingredients

@router.post("/find_recipes")
async def get_recipes(input_ingredients: str):
    if not input_ingredients:
        raise HTTPException(status_code=400, detail="Nguyên liệu không thể trống.")

    input_ingredients_list = [ingredient.strip() for ingredient in input_ingredients.split(",")]
    # input_ingredients_list = await detect_and_translate_to_english(input_ingredients_list)

   
    recipes = await find_recipes_by_ingredients(input_ingredients_list)
    if not recipes:
        raise HTTPException(status_code=404, detail="Không tìm thấy món ăn phù hợp.")
    
    return {"recipes": recipes}


@router.get("/get_all_recipes")
async def get_all():
    recipes = await get_all_recipes()
    if not recipes:
        raise HTTPException(status_code=404, detail="Không tìm thấy công thức món ăn.")
    
    return {"recipes": recipes}
