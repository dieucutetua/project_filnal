from fastapi import APIRouter
from ultralytics import YOLO
from PIL import Image
from bson import ObjectId
from hashlib import sha256
from datetime import datetime
from bcrypt import hashpw, checkpw, gensalt
from database import users_collection
from fastapi import FastAPI, HTTPException
from models.modelUser import UserCreate, UserLogin, UpdatePasswordRequest
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

@router.put("/update-password")
async def update_password(request: UpdatePasswordRequest):
    try:
        user_id = ObjectId(request.user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")
    # Tìm người dùng trong MongoDB theo user_id
    user = await users_collection.find_one({"_id": user_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Kiểm tra mật khẩu cũ
    if not verify_password(request.old_password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")


    hashed_password =sha256(request.new_password.encode('utf-8')).hexdigest()

 
    result = await users_collection.update_one(
        {"_id": user_id},  
        {"$set": {"password": hashed_password, "updated_at": datetime.utcnow()}}  
    )


    if result.modified_count > 0:
        return {"message": "Password updated successfully."}
    else:
        raise HTTPException(status_code=500, detail="Error updating password.")