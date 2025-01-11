import os
from fastapi import APIRouter, HTTPException
from database import recipes_collection 
from typing import List
from deep_translator import GoogleTranslator
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
from fastapi import HTTPException
from typing import List
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

def match_ingredients(input_ingredient: str, recipe_ingredients: set):
    matched_ingredients = []
    for ingredient in recipe_ingredients:
        score = fuzz.ratio(input_ingredient.lower(), ingredient.lower())
        if score > 80:  
            matched_ingredients.append((ingredient, score))
    return matched_ingredients

def calculate_matching_ratio(input_ingredients, required_ingredients):
    matched_count = 0
    for ingredient in required_ingredients:
        if any(fuzz.ratio(ingredient.lower(), avail.lower()) > 80 for avail in input_ingredients):
            matched_count += 1
    if len(required_ingredients) > 0:
        match_ratio = (matched_count / len(required_ingredients)) * 100
    else:
        match_ratio = 0
    return match_ratio


async def find_recipes_by_ingredients(input_ingredients: List[str]):
    recipes_cursor = recipes_collection.find({"nor_ingredients": {"$in": input_ingredients}})
    recipes = await recipes_cursor.to_list(length=None)

    if not recipes:
        raise HTTPException(status_code=404, detail="Không tìm thấy công thức phù hợp với nguyên liệu.")
    
    results = []
    for recipe in recipes:
        matched_ingredients = []
        match_percentage = 0
        
        match_percentage = calculate_matching_ratio(input_ingredients, recipe["nor_ingredients"])
        
  
        for ingredient in input_ingredients:
            matched_ingredients.extend(match_ingredients(ingredient, recipe["nor_ingredients"]))
        
        if matched_ingredients:
            results.append({
                "id": str(recipe.get("_id", "")),
                "title": recipe.get("title", ""),
                "match_percentage": match_percentage,
                "matched_ingredients": [ingredient for ingredient, score in matched_ingredients],
                "image": recipe.get("image", ""),
                "description": recipe.get("description", ""),
                "instructions": recipe.get("instructions", ""),
                "recipe_url": recipe.get("recipe_url", ""),
                "ingredients": list(set(recipe.get("ingredients", []))),
                "steps": recipe.get("instructions", ""),
            })
    
 
    results = sorted(results, key=lambda x: x["match_percentage"], reverse=True)
    
    return results[:5] 