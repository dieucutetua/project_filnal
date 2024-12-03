import os
from datetime import datetime
from PIL import Image
import io
import imghdr
from cruds.image import save_image_info_to_db
from fastapi.responses import FileResponse
from fastapi import APIRouter,HTTPException
from database import images_collection
from typing import List
from models.modelImage import Image_DB
from cruds.image import delete_image_from_db
from pathlib import Path
import os


router = APIRouter()






@router.get("/user/{user_id}", response_model=List[Image_DB])
async def get_images_by_user(user_id: str):

    images_cursor = images_collection.find({"user_id": user_id}).sort("upload_time", -1)

    images = await images_cursor.to_list(length=None) 
    if not images:
        raise HTTPException(status_code=404, detail="No images found for this user.")
    return [
        Image_DB(
            image_id=image["image_id"],
            user_id=image["user_id"],
            image_path=image["image_path"],
            upload_time=image["upload_time"],
            detected_items=image["detected_items"]
        )
        for image in images
    ]



UPLOAD_FOLDER = "path/to/your/upload/folder"


@router.delete("/user/{user_id}/{image_id}", response_model=dict)
async def delete_image(user_id: str, image_id: str):
    try:
        image = await images_collection.find_one({"user_id": user_id, "image_id": image_id})
        
        if not image:
            raise HTTPException(status_code=404, detail="Image not found for this user.")
        

        image_path = image["image_path"]
        

        if os.path.exists(image_path):
            os.remove(image_path)
        else:
            raise HTTPException(status_code=404, detail="Image file not found in the system")
        

        delete_result = await images_collection.delete_one({"user_id": user_id, "image_id": image_id})
        

        
        return {"message": "Image deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while deleting the image: {str(e)}")

@router.get("/{image_id}")
async def get_image(image_id: str):
    try:

        image_one = await images_collection.find_one({"image_id": image_id})
        image = await image_one.to_list(length=None) 
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        

        image_path = image['image_path']
        
  
        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Image file not found in the system")
        
        return [
        Image_DB(
            image_id=image["image_id"],
            user_id=image["user_id"],
            image_path=image["image_path"],
            upload_time=image["upload_time"],
            detected_items=image["detected_items"]
        )
    ] 

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while retrieving the image: {str(e)}")
    
@router.get("/user/{user_id}/{image_id}", response_model=List[Image_DB])
async def get_image_by_id(user_id: str, image_id: str):
    try:
 
        image = await images_collection.find_one({"user_id": user_id, "image_id": image_id})
        
        if not image:
            raise HTTPException(status_code=404, detail="Image not found for this user.")
        
    
        image_path = image["image_path"]
        
   
        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Image file not found in the system")
        
    
        return [
        Image_DB(
            image_id=image["image_id"],
            user_id=image["user_id"],
            image_path=image["image_path"],
            upload_time=image["upload_time"],
            detected_items=image["detected_items"]
        )
    ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while retrieving the image: {str(e)}")