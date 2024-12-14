from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI


client = AsyncIOMotorClient("mongodb://localhost:27017")  
db = client["DATN"]  



users_collection = db["users"]
images_collection = db["images"]
recog_collection = db["recog"]
food_items_collection = db["food_items"]
suggestions_collection = db["food_suggestions"]
recipes_collection = db["recipes_collection"]