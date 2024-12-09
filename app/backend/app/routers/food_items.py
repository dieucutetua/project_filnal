from fastapi import APIRouter

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
from bson import ObjectId

from models.modelFoodItem import FoodItem
from database import food_items_collection
router = APIRouter()

@router.post("/foods", response_model=FoodItem)
async def add_food(food: FoodItem):
    food_dict = food.dict(exclude={"food_id"}) 
    result = await food_items_collection.insert_one(food_dict)
    food_dict["food_id"] = str(result.inserted_id)
    return food_dict

@router.delete("/foods/{user_id}/{food_id}")
async def delete_food(user_id :str , food_id: str):
    result = await food_items_collection.delete_one({"user_id": user_id,  "_id": ObjectId(food_id)})
    if result.deleted_count == 1:
        return {"message": "Food deleted successfully"}
    raise HTTPException(status_code=404, detail="Food not found")

@router.get("/foods/{user_id}", response_model=List[FoodItem])
async def find_food_by_id(user_id :str ):
    food_cursor = food_items_collection.find({"user_id": user_id })
    
    foods = []
    async for food in food_cursor:
        food["food_id"] = str(food["_id"])  
        del food["_id"]
        foods.append(food)
    return foods

