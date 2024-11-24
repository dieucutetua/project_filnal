# crud.py
from passlib.context import CryptContext
from database import users_collection,images_collection,recog_collection
from schemas import UserCreate
from fastapi import HTTPException
from hashlib import sha256
from datetime import datetime
from PIL import Image
UPLOAD_FOLDER = "path/to/your/upload/folder"

async def save_file(file, upload_folder):
    # Đọc dữ liệu từ file upload
    image_data = await file.read()
    image_stream = io.BytesIO(image_data)

    # Kiểm tra nếu tệp là ảnh hợp lệ
    if not imghdr.what(image_stream):
        raise ValueError(f"{file.filename} is not a valid image file.")

    # Đặt tên thư mục lưu trữ theo thời gian hiện tại
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    time_folder = os.path.join(upload_folder, current_time)
    os.makedirs(time_folder, exist_ok=True)

    # Lưu file
    file_path = os.path.join(time_folder, file.filename)
    image = Image.open(image_stream)
    image.save(file_path)
     
    # Lưu thông tin vào MongoDB
    await save_image_info_to_db(file.filename, user_id, file_path, list(set(detected_names)))
    return file_path
async def save_image_info_to_db(image_id, user_id, image_path, detected_items):
    image_doc = {
        "image_id": image_id,
        "user_id": user_id,
        "image_path": image_path,
        "upload_time": datetime.now(),
        "detected_items": detected_items
    }
    await images_collection.insert_one(image_doc)
async def save_recog_to_db(user_id, list_name, update_at):
    if update_at is None:
        update_at = datetime.now()
    recog_doc = {
   
        "user_id": user_id,
        "list_name": list_name,
        "create_at": datetime.now(),
        "update_at": update_at
    }
       # Lưu tài liệu vào MongoDB
    await recog_collection.insert_one(recog_doc)


async def delete_image_from_db(image_id: str):
    # Xóa hình ảnh theo ID
    result = await images_collection.delete_one({"image_id": image_id})
    
    # Kiểm tra nếu có bản ghi bị xóa
    if result.deleted_count == 0:
        return None  # Nếu không tìm thấy hình ảnh, trả về None
    
    # Trả về thông tin hình ảnh đã xóa (nếu cần)
    return result