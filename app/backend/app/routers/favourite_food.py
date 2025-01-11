from fastapi import APIRouter

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
from bson import ObjectId

from models.modelFavourite import FavouriteFood,FavouriteFood_Create,CheckFavouriteRequest
from database import favourite_food
router = APIRouter()

from fastapi import HTTPException, status

@router.post("/favourite", response_model=FavouriteFood_Create)
async def add_food(food: FavouriteFood_Create):
    print(food.dict())  
    existing_food = await favourite_food.find_one({
        "user_id": food.user_id,
        "food_id": food.food_id
    })
    
    if existing_food:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Món ăn này đã có trong danh sách yêu thích của bạn."
        )
    try:
        food_dict = food.dict(exclude={"food_id"})
        food_dict["food_id"] = food.food_id 
        result = await favourite_food.insert_one(food_dict)
        food_dict["food_id"] = food.food_id 
        return food_dict  
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể thêm món ăn vào danh sách yêu thích. Vui lòng thử lại."
        ) from e


@router.get("/favourite_food/check")
async def check_favourite(request: CheckFavouriteRequest):
    exists = check_food_in_favourites(request.user_id, request.food_id)
    return {"exists": exists}

def check_food_in_favourites(user_id: str, food_id: str) -> bool:
  
    favourite = favourite_food.find_one({"user_id": user_id, "food_id": food_id})
    return favourite is not None



@router.delete("/delete/{user_id}/{food_id}")
async def delete_food(user_id: str, food_id: str):
    try:
        result = await favourite_food.delete_one({"user_id": user_id, "food_id": food_id})
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
        foods.append(FavouriteFood(**food)) 
    return foods
