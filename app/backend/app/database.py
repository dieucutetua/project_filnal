from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI

# Kết nối đến MongoDB
client = AsyncIOMotorClient("mongodb://localhost:27017")  
db = client["DATN"]  


# Khởi tạo các collection


users_collection = db["users"]
images_collection = db["images"]
food_items_collection = db["food_items"]
suggestions_collection = db["food_suggestions"]