import openai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

openai.api_key = api_key


ingredients = ["chicken", "carrot", "potato", "onion"]


prompt = f"""
Tôi có các nguyên liệu sau: {', '.join(ingredients)}.
Hãy gợi ý 3 món ăn có thể chế biến từ các nguyên liệu này.
Cung cấp hướng dẫn ngắn gọn để thực hiện từng món.
"""


response = openai.Completion.create(
    model="gpt-3.5-turbo",
    prompt=prompt,
    max_tokens=300,
    temperature=0.7
)


suggestions = response.choices[0].text.strip()
print(suggestions)
