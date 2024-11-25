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
        # Chuẩn bị prompt cho GPT
        prompt = f"""
        I have the following ingredients: {', '.join(request.ingredients)}. 
        Please suggest some dishes I can cook with these ingredients and include brief descriptions.
        """

        # Gửi yêu cầu tới GPT-4 sử dụng API đúng cách
        response = openai.ChatCompletion.create(
            model="gpt-4",  # Hoặc "gpt-3.5-turbo"
            messages=[  # Đảm bảo sử dụng messages với đúng cú pháp
                {"role": "system", "content": "You are a professional chef."},  # Cung cấp ngữ cảnh cho mô hình
                {"role": "user", "content": prompt}  # Yêu cầu từ người dùng
            ],
            max_tokens=150,  # Giới hạn số từ trong phản hồi
            temperature=0.7,  # Điều chỉnh độ sáng tạo của câu trả lời
        )

        # Trích xuất kết quả từ GPT
        suggestions = response['choices'][0]['message']['content']

        # Dịch kết quả sang tiếng Việt bằng Deep Translator
        translated_suggestions = GoogleTranslator(source='en', target='vi').translate(suggestions)

        # Trả về kết quả gợi ý món ăn
        return {
            "original_suggestions": suggestions,
            "translated_suggestions": translated_suggestions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))