import re
from pymongo import MongoClient

# Kết nối MongoDB (Đảm bảo bạn đã thay đổi thông tin kết nối phù hợp)
client = MongoClient("mongodb://localhost:27017/")
db = client["DATN"]
recipes_collection = db["recipes_collection"]

def extract_ingredient_name(ingredient: str) -> str:
    """
    Hàm lọc tên nguyên liệu từ chuỗi nguyên liệu có chứa định lượng hoặc thông tin phụ.
    """
    # Loại bỏ các từ thừa và các chi tiết phụ
    ingredient = re.sub(r"(leaves?|bunches?|cloves?|pieces?)\s*(of)?\s*", "", ingredient, flags=re.IGNORECASE)
    ingredient = re.sub(r"[\s,]+", " ", ingredient)  # Loại bỏ các dấu phẩy dư thừa và khoảng trắng thừa
    ingredient = ingredient.strip().lower()  # Chuyển thành chữ thường để chuẩn hóa
    return ingredient

# Cập nhật từng tài liệu trong MongoDB
for recipe in recipes_collection.find():
    ingredients = recipe.get("ingredients", [])
    
    # Kiểm tra nếu nguyên liệu không rỗng
    if ingredients:
        normalized_ingredients = [extract_ingredient_name(ing) for ing in ingredients]
        
        # Thêm trường normalized_ingredients vào MongoDB
        try:
            recipes_collection.update_one(
                {"_id": recipe["_id"]},  # Tìm đúng tài liệu để cập nhật
                {"$set": {"nor_ingredients": normalized_ingredients}}
            )
        except Exception as e:
            print(f"Error updating recipe {_id}: {e}")
    else:
        print(f"Recipe {_id} has no ingredients.")
        
print("Cập nhật nor_ingredients thành công!")
