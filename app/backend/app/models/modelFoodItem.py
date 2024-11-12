from pydantic import BaseModel
class FoodItem(BaseModel):
    food_id: str
    name: str
    image_path: str
    ingredients: list[str]
    description: str
    steps:str

    class Config:
        orm_mode = True
