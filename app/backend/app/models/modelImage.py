from datetime import datetime
from pydantic import BaseModel
class Image(BaseModel):
    image_id: str
    user_id: str  # Liên kết đến user
    image_path: str
    upload_time: datetime

    class Config:
        orm_mode = True
