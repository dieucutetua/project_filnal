from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

class FavouriteFood(BaseModel):
    
    food_id: str
    user_id:str
    name: str
    source: str
    preptime: int
    waittime: int
    cooktime: int
    servings: int
    comments: Optional[str]
    calories: int
    fat: int
    satfat: int
    carbs: int
    fiber: int
    sugar: int
    protein: int
    instructions: str
    ingredients: List[str]
    tags: List[str]

    class Config:
        orm_mode = True
class FavouriteFood_Create(BaseModel):
    user_id:str
    name: str
    source: str
    preptime: int
    waittime: int
    cooktime: int
    servings: int
    comments: Optional[str]
    calories: int
    fat: int
    satfat: int
    carbs: int
    fiber: int
    sugar: int
    protein: int
    instructions: str
    ingredients: List[str]
    tags: List[str]

    class Config:
        orm_mode = True
        