from fastapi import APIRouter

router = APIRouter()

@router.get("/suggestions")
async def get_suggestions(food_items: list[str]):
    # Giả lập gợi ý món ăn
    suggestions = [
        {"name": "Salad rau củ", "image": "/images/salad.jpg", "ingredients": "Cà chua, dưa chuột, cà rốt", "steps": "Chế biến các nguyên liệu và trộn đều."},
        {"name": "Nộm rau củ", "image": "/images/noom.jpg", "ingredients": "Cà rốt, dưa chuột", "steps": "Xào rau và trộn với gia vị."}
    ]
    return {"suggestions": suggestions}
