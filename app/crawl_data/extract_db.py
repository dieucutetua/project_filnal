import re
from pymongo import MongoClient, UpdateOne

# Kết nối tới MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["DATN"]  # Thay tên database
recipes_collection = db["recipes_collection"]  # Thay tên collection

def extract_ingredient_name(ingredient: str) -> str:
    """
    Lọc tên nguyên liệu từ chuỗi nguyên liệu có chứa định lượng hoặc thông tin phụ.
    """
    # Loại bỏ định lượng, đơn vị đo lường và mô tả phụ
    cleaned_ingredient = re.sub(
        r"^[\d\/\s-]+(?:cup|teaspoon|tablespoon|clove|bulb|ounce|ounces|grams|liters|slice|slices|bunch|bunches|cup|ml|kg|lb|oz|dry|ground|unsalted|minced|softened|at room temperature|freshly|large|medium|small|julienned|zested|juiced|whole|extra-large|extra-large|fresh|chopped)*[\s]*",
        "",
        ingredient,
        flags=re.IGNORECASE
    )
    
    # Loại bỏ các từ thừa và các chi tiết phụ như "leaves", "bunches", "cloves", "pieces", "fresh", "chopped"
    cleaned_ingredient = re.sub(r"(leaves?|bunches?|cloves?|pieces?|fresh|chopped|minced)\s*(of)?\s*", "", cleaned_ingredient, flags=re.IGNORECASE)
    
    # Loại bỏ dấu phẩy và khoảng trắng thừa
    cleaned_ingredient = re.sub(r"[\s,]+", " ", cleaned_ingredient)
    
    # Chuẩn hóa thành chữ thường và loại bỏ khoảng trắng thừa
    cleaned_ingredient = cleaned_ingredient.strip().lower()

    return cleaned_ingredient


def update_normalized_ingredients():
    """
    Chuẩn hóa nguyên liệu và cập nhật vào cơ sở dữ liệu.
    """
    # Danh sách các bản cập nhật
    updates = []

    # Duyệt qua tất cả tài liệu
    for recipe in recipes_collection.find({}, {"_id": 1, "ingredients": 1}):
        ingredients = recipe.get("ingredients", [])
        if isinstance(ingredients, list):  # Kiểm tra loại dữ liệu
            normalized_ingredients = [extract_ingredient_name(ing) for ing in ingredients]
            updates.append(
                UpdateOne(
                    {"_id": recipe["_id"]},  # Tìm đúng tài liệu
                    {"$set": {"nor_ingredients": normalized_ingredients}}
                )
            )

    # Cập nhật theo nhóm
    if updates:
        result = recipes_collection.bulk_write(updates)
        print(f"Cập nhật thành công {result.modified_count} tài liệu.")

# Chạy hàm cập nhật
if __name__ == "__main__":
    update_normalized_ingredients()
    print("Hoàn thành cập nhật nor_ingredients!")
