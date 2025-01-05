from fastapi import APIRouter
from ultralytics import YOLO
from PIL import Image
from hashlib import sha256
from datetime import datetime
from fastapi import FastAPI, HTTPException
from models.modelUser import UserCreate, UserLogin, User
from cruds.user import create_user, get_user_by_email, verify_password
from database import users_collection

router = APIRouter()
# Dang ki
async def get_all_users():
    user_cursor = users_collection.find()
    users = await user_cursor.to_list(length=None)

    results = []
    for user in users:
        results.append({
            "username": user.get("username", ""),
            "email": user.get("email", ""),
            "created_at":user.get("created_at", ""),
        })

    return results

@router.get("/getall_users/")
async def getall_users():
   
    users = await get_all_users()
    return users
  

@router.delete("/delete_user/{email}")
async def delete_user(email: str):

    user = await users_collection.find_one({"email": email})
    result = await users_collection.delete_one({"email": email})
    if result.deleted_count == 1:
        return {"message": f"User with email {email} has been deleted"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete user")