from fastapi import APIRouter



from deep_translator import GoogleTranslator

from fastapi import FastAPI, UploadFile, File, Form
import os
from ultralytics import YOLO
from PIL import Image
import io
from hashlib import sha256
from datetime import datetime
import imghdr
from fastapi import FastAPI, HTTPException
from models.modelUser import UserCreate, UserLogin, User
from cruds.image import save_image_info_to_db,save_recog_to_db,process_and_detect

router = APIRouter()


UPLOAD_FOLDER = "uploads/images"

# model = YOLO('D:/DATN/Source_project/app/backend/models/best_model.pt') 
model = YOLO("C:/Users/ADMIN/Desktop/fe/project_filnal/app/backend/models/best_12.pt")  # Hoặc "last.pt" nếu bạn muốn dùng trọng số từ epoch cuối
# model.eval()

@router.post("/")
async def upload_image(files: list[UploadFile] = File(...), user_id: str = Form(...)):

    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    time_folder = os.path.join(UPLOAD_FOLDER, current_time)
    os.makedirs(time_folder, exist_ok=True)

    upload_images_file = []
    vietnamese_list = []
    result_image_paths = []

    for file in files:
        # Lưu tạm thời file upload
        image_data = await file.read()
        image_stream = io.BytesIO(image_data)
        if not imghdr.what(image_stream):
            return {"error": f"{file.filename} is not a valid image file."}

        image = Image.open(image_stream)
        file_path = os.path.join(time_folder, file.filename)
        image.save(file_path)
        upload_images_file.append(file.filename)

        # Gọi hàm xử lý
        detected_items, result_image_path = process_and_detect(
            image_path=file_path, model=model, output_folder=time_folder
        )
        vietnamese_list.extend(detected_items)
        result_image_paths.append(result_image_path)

        # Lưu vào cơ sở dữ liệu
        await save_image_info_to_db(file.filename, user_id, file_path, detected_items)
        await save_recog_to_db(user_id, detected_items, datetime.now())

    return {
        "info": f"Files saved at '{time_folder}'",
        "detected_items": vietnamese_list,
        "result_image_paths": result_image_paths
    }

    
