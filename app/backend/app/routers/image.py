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





# API lấy tất cả ảnh của user_id
@router.get("/images/user/{user_id}", response_model=List[Image_DB])
async def get_images_by_user(user_id: str):
    # Tìm tất cả ảnh của user_id trong cơ sở dữ liệu
    images_cursor = images_collection.find({"user_id": user_id})
    
     # Chuyển đổi AsyncIOMotorCursor thành danh sách
    images = await images_cursor.to_list(length=None)  # length=None lấy toàn bộ kết quả
    if not images:
        raise HTTPException(status_code=404, detail="No images found for this user.")
    
    # Chuyển các ảnh thành danh sách và trả về
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



UPLOAD_FOLDER = "path/to/your/upload/folder"  # Đường dẫn đến thư mục lưu ảnh

# Hàm để xóa một hình ảnh từ cơ sở dữ liệu và hệ thống tệp
@router.delete("/images/delete/{image_id}")
async def delete_image(image_id: str):
    try:
        # Tìm hình ảnh trong cơ sở dữ liệu
        image = await delete_image_from_db(image_id)
        
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Lấy đường dẫn tệp từ hình ảnh trong cơ sở dữ liệu
        image_path = image['image_path']
        
        # Xóa tệp hình ảnh khỏi hệ thống tệp
        if os.path.exists(image_path):
            os.remove(image_path)
        else:
            raise HTTPException(status_code=404, detail="Image file not found in the system")

        return {"message": f"Image with ID {image_id} has been deleted successfully."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while deleting the image: {str(e)}")
