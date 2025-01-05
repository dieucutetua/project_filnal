from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

class Recipes(BaseModel):
    id: str
    title: str
    recipe_url: str
    description : str
    image : str
    instructions: str
    ingredients: List[str]


    class Config:
        orm_mode = True