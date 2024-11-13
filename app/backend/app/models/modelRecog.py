from datetime import datetime
from pydantic import BaseModel
class Recog(BaseModel):
    recog_id: str
    user_id: str  # Liên kết đến user
    list_name: str
    creat_at :datetime
    upload_at: datetime

    class Config:
        orm_mode = True
