from pydantic import BaseModel
from datetime import datetime
class FoodSuggestion(BaseModel):
    suggestion_id: str
    user_id: str  # Liên kết tới user
    food_id: str  # Liên kết tới FoodItem
    suggestion_date: datetime

    class Config:
        orm_mode = True
