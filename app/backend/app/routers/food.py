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
from cruds.image import save_image_info_to_db,save_recog_to_db

router = APIRouter()


UPLOAD_FOLDER = "uploads/images"

# model = YOLO('D:/DATN/Source_project/app/backend/models/best_model.pt') 
model = YOLO("D:/DATN/Source_project/app/backend/models/best_6.pt")  # Hoặc "last.pt" nếu bạn muốn dùng trọng số từ epoch cuối
# model.eval()

@router.post("/")
async def upload_image(files: list[UploadFile] = File(...), user_id: str = Form(...)):

    # Lấy thời gian hiện tại để tạo thư mục riêng cho lần upload này
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    time_folder = os.path.join(UPLOAD_FOLDER, current_time)
    os.makedirs(time_folder, exist_ok=True)

    upload_images_file = []
    names = []
    for file in files:
        image_data = await file.read()
        image_stream = io.BytesIO(image_data)

        # Kiểm tra xem tệp có phải là ảnh không
        if not imghdr.what(image_stream):
            return {"error": f"{file.filename} is not a valid image file."}

        image = Image.open(image_stream)

        file_path = os.path.join(time_folder, file.filename)
        image.save(file_path)
        upload_images_file.append(file.filename)

        
        results = model(file_path)  #  model.predict(file_path) n
        for result in results:
            for detection in result.boxes:
                class_id = int(detection.cls)
                class_name = model.names[class_id]

                names.append(class_name)
         # Danh sách từ tiếng Anh
        english_list = list(set(names))

        # Khởi tạo Translator
        # translator = Translator()
        translator = GoogleTranslator(source="en", target="vi")

        # Dịch từng từ trong danh sách sang tiếng Việt
        
        # Dịch từng từ trong danh sách sang tiếng Việt
        vietnamese_list = [translator.translate(word) for word in english_list]
        await save_image_info_to_db(file.filename, user_id, file_path, vietnamese_list)

       

        await save_recog_to_db(user_id,vietnamese_list,datetime.now())
   
    return {"info": f"Files saved at '{time_folder}'", "detected_items": vietnamese_list}
    
