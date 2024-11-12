from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
# Đăng ký
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Đăng nhập
class UserLogin(BaseModel):
    email: str
    password: str

# Trả về thông tin người dùng
class User(BaseModel):
    username: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
