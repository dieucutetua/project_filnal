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

    existing_user = await get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    

    user_id = await create_user(user)
    return {"message": "User created successfully", "user_id": user_id}



@router.post("/login/")
async def login_user(user: UserLogin):

    existing_user = await get_user_by_email(user.email)
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    

    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    return {
        "message": "Login successful",
        "user_id": str(existing_user["_id"]),
        "username": existing_user["username"],
        "email": existing_user["email"]
    }

