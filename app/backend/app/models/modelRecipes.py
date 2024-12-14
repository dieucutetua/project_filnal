from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

class Recipes(BaseModel):
    id: str
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