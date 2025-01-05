from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

class FavouriteFood(BaseModel):
    
    food_id: str
    user_id:str
    title: str
    recipe_url: str
    description : str
    image : str
    instructions: str
    ingredients: List[str]


    class Config:
        orm_mode = True
class FavouriteFood_Create(BaseModel):
    user_id:str
    food_id: str
    title: str
    recipe_url: str
    description : str
    image : str
    instructions: str
    ingredients: List[str]


    class Config:
        orm_mode = True
        
class CheckFavouriteRequest(BaseModel):
    user_id: str
    food_id: str
    class Config:
        orm_mode = True
        