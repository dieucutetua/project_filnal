import requests
from pymongo import MongoClient

# Kết nối MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['DATN']  # Tạo cơ sở dữ liệu
collection = db['recipes_collection']  # Tạo bảng 'detailed_recipes'

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

# Hàm lấy chi tiết món ăn
def fetch_recipe_details(recipe_id):
    """
    Gọi API để lấy chi tiết món ăn dựa trên ID.
    """
    url = f"{BASE_URL}{recipe_id}/information"
    params = {'apiKey': API_KEY}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return {
            'id': data['id'],
            'title': data['title'],
            'image': data.get('image', ''),
            'ingredients': [ing['original'] for ing in data['extendedIngredients']],
            'description': data.get('summary', '').replace('<b>', '').replace('</b>', ''),
            'instructions': data.get('instructions', ''),
            'recipe_url': data.get('sourceUrl', '')
        }
    else:
        print(f"Error fetching details for Recipe ID {recipe_id}: {response.status_code}")
        return None

# Hàm lưu dữ liệu vào MongoDB
def save_to_mongo(recipe_data):
    """
    Lưu món ăn vào MongoDB (cập nhật nếu tồn tại).
    """
    if recipe_data:
        collection.update_one({'id': recipe_data['id']}, {'$set': recipe_data}, upsert=True)

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
    ingredients = "chicken, garlic, onion"
    crawl_recipes(ingredients, number=100)
    print("Dữ liệu món ăn đã được lưu vào MongoDB!")
