import openai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

openai.api_key = api_key

# Danh sách nguyên liệu
ingredients = ["chicken", "carrot", "potato", "onion"]

# Prompt gợi ý món ăn
prompt = f"""
Tôi có các nguyên liệu sau: {', '.join(ingredients)}.
Hãy gợi ý 3 món ăn có thể chế biến từ các nguyên liệu này.
Cung cấp hướng dẫn ngắn gọn để thực hiện từng món.
"""

# Gửi yêu cầu đến OpenAI
response = openai.Completion.create(
    model="gpt-3.5-turbo",  # Hoặc "gpt-4" nếu bạn có quyền truy cập
    prompt=prompt,
    max_tokens=300,
    temperature=0.7
)

# Lấy và in kết quả
suggestions = response.choices[0].text.strip()
print(suggestions)
