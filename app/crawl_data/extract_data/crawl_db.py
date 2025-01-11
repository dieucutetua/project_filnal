import requests
from pymongo import MongoClient
import re


client = MongoClient('mongodb://localhost:27017/')
db = client['DATN']  
recipes_collection = db['recipes_collection']  


API_KEY = '9a456acc1a514aef8f18fc2be5fb319d'
BASE_URL = "https://api.spoonacular.com/recipes/"


def fetch_recipe_ids(ingredients, number=100):
    """
    Gọi API để lấy danh sách ID món ăn dựa trên nguyên liệu.
    """
    url = f"{BASE_URL}findByIngredients"
    params = {
        'ingredients': ingredients,
        'number': number,
        'apiKey': API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return [recipe['id'] for recipe in response.json()]
    else:
        print(f"Error fetching recipe IDs: {response.status_code}")
        return []


def extract_ingredient_name(ingredient: str) -> str:

    ingredient = re.sub(r"(leaves?|bunches?|cloves?|pieces?)\s*(of)?\s*", "", ingredient, flags=re.IGNORECASE)
    ingredient = re.sub(r"[\s,]+", " ", ingredient)  
    ingredient = ingredient.strip().lower() 
    return ingredient


def fetch_recipe_details(recipe_id):
  
    url = f"{BASE_URL}{recipe_id}/information"
    params = {'apiKey': API_KEY}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
   
        ingredients = [ing['original'] for ing in data['extendedIngredients']]  #
        normalized_ingredients = [extract_ingredient_name(ing['original']) for ing in data['extendedIngredients']]  
        

        recipe_data = {
            'id': data['id'],
            'title': data['title'],
            'image': data.get('image', ''),
            'ingredients': ingredients,  #
            'nor_ingredients': normalized_ingredients,  
            'description': data.get('summary', '').replace('<b>', '').replace('</b>', ''),
            'instructions': data.get('instructions', ''),
            'recipe_url': data.get('sourceUrl', '')
        }
        
        return recipe_data
    else:
        print(f"Error fetching details for Recipe ID {recipe_id}: {response.status_code}")
        return None


def save_to_mongo(recipe_data):
    if recipe_data:
        recipes_collection.update_one({'id': recipe_data['id']}, {'$set': recipe_data}, upsert=True)


def crawl_recipes(ingredients, number=100):
    recipe_ids = fetch_recipe_ids(ingredients, number)
    print(f"Found {len(recipe_ids)} recipes. Fetching details...")
    for recipe_id in recipe_ids:
        recipe_details = fetch_recipe_details(recipe_id)
        if recipe_details:
            save_to_mongo(recipe_details)
            print(f"Saved recipe: {recipe_details['title']}")

if __name__ == "__main__":

    ingredients = "egg"
    crawl_recipes(ingredients, number=100)
    print("Dữ liệu món ăn đã được lưu vào MongoDB!")
