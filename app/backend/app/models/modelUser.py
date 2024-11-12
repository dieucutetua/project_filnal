from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Mô hình để tạo người dùng mới (đăng ký)
class UserCreate(BaseModel):
    username: str
    email: EmailStr  = "ltd@email.com"
    password: str

# Mô hình đăng nhập người dùng
class UserLogin(BaseModel):
    email: EmailStr  = "ltd@email.com"
    password: str

# Mô hình trả về thông tin người dùng khi đăng nhập thành công
class User(BaseModel):
    user_id: str
    username: str
    password: str
    email: EmailStr  = "ltd@email.com"
    created_at: datetime
    updated_at: datetime
