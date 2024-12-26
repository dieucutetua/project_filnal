from fastapi import APIRouter

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
from bson import ObjectId

from models.modelFavourite import FavouriteFood,FavouriteFood_Create
from database import favourite_food
router = APIRouter()

@router.post("/favourite", response_model=FavouriteFood_Create)
async def add_food(food: FavouriteFood_Create):
    print(food.dict())  # Xem dữ liệu nhận được
    food_dict = food.dict(exclude={"food_id"}) 
    result = await favourite_food.insert_one(food_dict)
    food_dict["food_id"] = str(result.inserted_id)  
    return food_dict

@router.delete("/delete/{user_id}/{food_id}")
async def delete_food(user_id: str, food_id: str):
    try:
        result = await favourite_food.delete_one({"user_id": user_id, "_id": ObjectId(food_id)})
        if result.deleted_count == 1:
            return {"message": "Food deleted successfully"}
        raise HTTPException(status_code=404, detail="Food not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid food ID")

@router.get("/favourite/{user_id}", response_model=List[FavouriteFood])
async def find_food_by_id(user_id: str):
    food_cursor = favourite_food.find({"user_id": user_id})
    foods = []
    async for food in food_cursor:
        food["food_id"] = str(food["_id"])  # Chuyển _id sang food_id
        del food["_id"]  # Xóa trường _id khỏi dữ liệu
        foods.append(FavouriteFood(**food))  # Đảm bảo dữ liệu phù hợp với model
    return foods
