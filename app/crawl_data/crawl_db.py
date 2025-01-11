import requests
from pymongo import MongoClient
import re

# Kết nối MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['DATN']  # Tạo cơ sở dữ liệu
recipes_collection = db['recipes_collection']  # Tạo bảng 'recipes_collection'

# API Key của bạn
API_KEY = '9a456acc1a514aef8f18fc2be5fb319d'
BASE_URL = "https://api.spoonacular.com/recipes/"

# Hàm lấy danh sách ID món ăn
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

# Hàm chuẩn hóa tên nguyên liệu
def extract_ingredient_name(ingredient: str) -> str:
    """
    Lọc tên nguyên liệu từ chuỗi nguyên liệu có chứa định lượng hoặc thông tin phụ.
    """
    # Loại bỏ các từ thừa và các chi tiết phụ
    ingredient = re.sub(r"(leaves?|bunches?|cloves?|pieces?)\s*(of)?\s*", "", ingredient, flags=re.IGNORECASE)
    ingredient = re.sub(r"[\s,]+", " ", ingredient)  # Loại bỏ các dấu phẩy dư thừa và khoảng trắng thừa
    ingredient = ingredient.strip().lower()  # Chuyển thành chữ thường để chuẩn hóa
    return ingredient

# Hàm lấy chi tiết món ăn và chuẩn hóa nguyên liệu
def fetch_recipe_details(recipe_id):
    """
    Gọi API để lấy chi tiết món ăn dựa trên ID và chuẩn hóa nguyên liệu.
    """
    url = f"{BASE_URL}{recipe_id}/information"
    params = {'apiKey': API_KEY}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        # Chuẩn hóa nguyên liệu trước khi lưu vào trường nor_ingredients
        ingredients = [ing['original'] for ing in data['extendedIngredients']]  # Lấy nguyên liệu gốc
        normalized_ingredients = [extract_ingredient_name(ing['original']) for ing in data['extendedIngredients']]  # Chuẩn hóa nguyên liệu
        
        # Tạo dữ liệu để lưu vào MongoDB
        recipe_data = {
            'id': data['id'],
            'title': data['title'],
            'image': data.get('image', ''),
            'ingredients': ingredients,  # Lưu nguyên liệu gốc
            'nor_ingredients': normalized_ingredients,  # Lưu nguyên liệu đã chuẩn hóa
            'description': data.get('summary', '').replace('<b>', '').replace('</b>', ''),
            'instructions': data.get('instructions', ''),
            'recipe_url': data.get('sourceUrl', '')
        }
        
        return recipe_data
    else:
        print(f"Error fetching details for Recipe ID {recipe_id}: {response.status_code}")
        return None

# Hàm lưu dữ liệu vào MongoDB
def save_to_mongo(recipe_data):
    """
    Lưu món ăn vào MongoDB (cập nhật nếu tồn tại).
    """
    if recipe_data:
        recipes_collection.update_one({'id': recipe_data['id']}, {'$set': recipe_data}, upsert=True)

# Crawl dữ liệu từ API và lưu vào MongoDB
def crawl_recipes(ingredients, number=100):
    """
    Crawl món ăn dựa trên nguyên liệu và lưu vào MongoDB.
    """
    recipe_ids = fetch_recipe_ids(ingredients, number)
    print(f"Found {len(recipe_ids)} recipes. Fetching details...")
    for recipe_id in recipe_ids:
        recipe_details = fetch_recipe_details(recipe_id)
        if recipe_details:
            save_to_mongo(recipe_details)
            print(f"Saved recipe: {recipe_details['title']}")

# Chạy chương trình
if __name__ == "__main__":
    # Crawl dữ liệu món ăn từ API
    ingredients = "egg"
    crawl_recipes(ingredients, number=100)
    print("Dữ liệu món ăn đã được lưu vào MongoDB!")
