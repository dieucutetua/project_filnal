from googletrans import Translator
from pymongo import MongoClient

# Khởi tạo dịch giả
translator = Translator()

# Kết nối MongoDB (thay đổi URL kết nối và tên database nếu cần)
client = MongoClient("mongodb://localhost:27017/")
db = client["DATN"]
recipes_collection = db["recipes_collection"]

# Hàm dịch nội dung
def translate_text(text):
    try:
        # Dịch văn bản từ tiếng Anh sang tiếng Việt
        translated = translator.translate(text, src='en', dest='vi')
        return translated.text
    except Exception as e:
        print(f"Error translating text: {e}")
        return text

# Lấy dữ liệu từ MongoDB và dịch các trường
def translate_recipes():
    recipes_cursor = recipes_collection.find()  # Lấy tất cả công thức
    translated_recipes = []

    for recipe in recipes_cursor:
        translated_recipe = recipe.copy()  # Tạo bản sao của công thức
        
        # Dịch các trường có văn bản
        translated_recipe['title'] = translate_text(recipe.get('title', ''))
        translated_recipe['description'] = translate_text(recipe.get('description', ''))
        translated_recipe['instructions'] = translate_text(recipe.get('instructions', ''))
        
        # Dịch các nguyên liệu
        translated_recipe['ingredients'] = [translate_text(ingredient) for ingredient in recipe.get('ingredients', [])]
        
        # Dịch trường "nor_ingredients"
        translated_recipe['nor_ingredients'] = [translate_text(ingredient) for ingredient in recipe.get('nor_ingredients', [])]
        
        # Lưu kết quả vào MongoDB
        update_recipe_with_translation(recipe['_id'], translated_recipe)

        # Thêm vào danh sách công thức đã dịch
        translated_recipes.append(translated_recipe)
    
    return translated_recipes

# Hàm cập nhật công thức đã dịch vào MongoDB
def update_recipe_with_translation(recipe_id, translated_recipe):
    recipes_collection.update_one(
        {'_id': recipe_id},  # Tìm công thức theo _id
        {'$set': {
            'title': translated_recipe['title'],
            'description': translated_recipe['description'],
            'instructions': translated_recipe['instructions'],
            'ingredients': translated_recipe['ingredients'],
            'nor_ingredients': translated_recipe['nor_ingredients']
        }}
    )

# Lấy các công thức đã dịch và in ra kết quả
translate_recipes()

# # In kết quả
# for recipe in translated_recipes:
#     print(f"Recipe ID: {recipe['_id']}")
#     print(f"Title: {recipe['title']}")
#     print(f"Description: {recipe['description']}")
#     print(f"Ingredients: {recipe['ingredients']}")
#     print(f"Nor Ingredients: {recipe['nor_ingredients']}")
#     print(f"Instructions: {recipe['instructions']}")
#     print("-" * 40)
