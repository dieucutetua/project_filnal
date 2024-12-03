from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai
import os
from models.modelImage import Image_DB
from typing import List,Any
from deep_translator import GoogleTranslator
from database import images_collection
from dotenv import load_dotenv

# Đặt API key của bạn
# Tải biến môi trường từ file .env
load_dotenv()

# Thiết lập khóa API
openai.api_key = os.getenv("OPENAI_API_KEY")
router = APIRouter()
# Model cho input
class IngredientsRequest(BaseModel):
    ingredients: list[str]  # Danh sách nguyên liệu



# API: Lấy detected_items của một ảnh cụ thể theo image_id
@router.get("/images/{image_id}/detected_items", response_model=List[Any])  # Trả về danh sách bất kỳ kiểu nào
async def get_detected_items_by_image_id(image_id: str):
    image = await images_collection.find_one({"image_id": image_id})
    detected_items = image.get("detected_items", [])
    return detected_items


@router.post("/suggest_food/")
async def suggest_food(request: IngredientsRequest):
    try:
        # Danh sách nguyên liệu
        ingredients = request

        # Prompt gợi ý món ăn
        prompt = f"""
        Tôi có các nguyên liệu sau: {', '.join(ingredients)}.
        Hãy gợi ý 3 món ăn có thể chế biến từ các nguyên liệu này.
        Cung cấp hướng dẫn ngắn gọn để thực hiện từng món.
        """

        # Gửi yêu cầu đến OpenAI
        response = openai.Completion.create(
            engine="text-davinci-003",  # Hoặc "gpt-4" nếu bạn có quyền truy cập
            prompt=prompt,
            max_tokens=300,
            temperature=0.7
        )

        # Lấy và in kết quả
        suggestions = response.choices[0].text.strip()
        return(suggestions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))