# crud.py
from passlib.context import CryptContext
from database import users_collection
from schemas import UserCreate
from fastapi import HTTPException
from hashlib import sha256
from datetime import datetime


# # Khởi tạo CryptContext để mã hóa mật khẩu
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # Mã hóa mật khẩu
# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# # Kiểm tra mật khẩu
# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)

# Tạo người dùng mới
async def create_user(user: UserCreate):
    # Hash mật khẩu trước khi lưu trữ
    hashed_password = sha256(user.password.encode('utf-8')).hexdigest()
    user_data = user.dict()
    user_data["password"] = hashed_password
    user_data["created_at"] = datetime.now().isoformat()
    user_data["updated_at"] = datetime.now().isoformat()

    # Thêm người dùng vào collection
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