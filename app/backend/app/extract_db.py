import re
from pymongo import MongoClient

# Kết nối tới MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["DATN"]  # Thay tên database
recipes_collection = db["recipes_collection"]  # Thay tên collection

def extract_ingredient_name(ingredient: str):
    """
    Hàm lọc tên nguyên liệu từ chuỗi nguyên liệu có chứa định lượng.
    Ví dụ: "2/3 cup panko" -> "panko"
    """
    cleaned_ingredient = re.sub(r"^[\d\/\s]+(?:cup|teaspoon|tablespoon|clove|extra-large|zested|juiced|dry|ground|unsalted|minced|softened|at room temperature|freshly|large|medium|small)*[\s]*", "", ingredient, flags=re.IGNORECASE)
    return cleaned_ingredient.strip()

# Cập nhật từng tài liệu trong MongoDB
for recipe in recipes_collection.find():
    ingredients = recipe.get("ingredients", [])
    normalized_ingredients = [extract_ingredient_name(ing) for ing in ingredients]

    # Thêm trường normalized_ingredients
    recipes_collection.update_one(
        {"_id": recipe["_id"]},  # Tìm đúng tài liệu để cập nhật
        {"$set": {"nor_ingredients": normalized_ingredients}}
    )

print("Cập nhật nor_ingredients thành công!")
