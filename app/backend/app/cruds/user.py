# crud.py
from passlib.context import CryptContext
from database import users_collection,images_collection,recog_collection
from models.modelUser import UserCreate
from fastapi import HTTPException
from hashlib import sha256
from datetime import datetime
from PIL import Image

async def create_user(user: UserCreate):
    # Hash mật khẩu trước khi lưu trữ
    hashed_password = sha256(user.password.encode('utf-8')).hexdigest()
    user_data = user.dict()
    user_data["password"] = hashed_password
    user_data["created_at"] = datetime.now().isoformat()
    user_data["updated_at"] = datetime.now().isoformat()


    result = await users_collection.insert_one(user_data)
    return str(result.inserted_id)

# Tìm người dùng theo username
# async def get_user_by_username(username: str):
#     return await users_collection.find_one({"username": username})

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Mã hóa mật khẩu người dùng nhập vào và so sánh với mật khẩu đã mã hóa trong cơ sở dữ liệu
    return sha256(plain_password.encode('utf-8')).hexdigest() == hashed_password

async def get_user_by_email(email: str):
    user = await users_collection.find_one({"email": email})
    return user