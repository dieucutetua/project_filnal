from fastapi import APIRouter
from ultralytics import YOLO
from PIL import Image
from hashlib import sha256
from datetime import datetime
from fastapi import FastAPI, HTTPException
from models.modelUser import UserCreate, UserLogin, User
from cruds.user import create_user, get_user_by_email, verify_password

router = APIRouter()
# Dang ki
@router.post("/register/")
async def register_user(user: UserCreate):
    # Kiểm tra nếu người dùng đã tồn tại
    existing_user = await get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Tạo người dùng mới
    user_id = await create_user(user)
    return {"message": "User created successfully", "user_id": user_id}


# Đăng nhập người dùng
@router.post("/login/")
async def login_user(user: UserLogin):
    # Kiểm tra người dùng có tồn tại không
    existing_user = await get_user_by_email(user.email)
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Kiểm tra mật khẩu
    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Trả về thông tin người dùng (trừ mật khẩu)
    return {
        "message": "Login successful",
        "user_id": str(existing_user["_id"]),
        "username": existing_user["username"],
        "email": existing_user["email"]
    }

