
from passlib.context import CryptContext
from database import users_collection,images_collection,recog_collection
from fastapi import HTTPException
from hashlib import sha256
from datetime import datetime
from PIL import Image
import cv2
import numpy as np
from deep_translator import GoogleTranslator
from ultralytics import YOLO
from PIL import Image
import os

UPLOAD_FOLDER = "path/to/your/upload/folder"

async def save_file(file, upload_folder):
    image_data = await file.read()
    image_stream = io.BytesIO(image_data)

    
    if not imghdr.what(image_stream):
        raise ValueError(f"{file.filename} is not a valid image file.")


    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    time_folder = os.path.join(upload_folder, current_time)
    os.makedirs(time_folder, exist_ok=True)


    file_path = os.path.join(time_folder, file.filename)
    image = Image.open(image_stream)
    image.save(file_path)
     

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

    await recog_collection.insert_one(recog_doc)


async def delete_image_from_db(image_id: str, user_id : str):

    result = await images_collection.delete_one({"image_id": image_id}, {"user_id" : user_id})
    

    if result.deleted_count == 0:
        return None  
    

    return result



def process_and_detect(image_path, model, output_folder):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Hình ảnh không hợp lệ hoặc không thể đọc.")

    results = model(image_path)
    names = []
    
    for result in results:
        for detection in result.boxes:
       
            class_id = int(detection.cls)
            class_name = model.names[class_id]
            confidence = float(detection.conf)  # tensor  float
            x1, y1, x2, y2 = map(int, detection.xyxy[0])  

            # bounding box 
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)  
            cv2.putText(image, f"{class_name} {confidence:.2f}", 
                        (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
            names.append(class_name)


    result_image_path = os.path.join(output_folder, f"result_{os.path.basename(image_path)}")
    cv2.imwrite(result_image_path, image)


    english_list = list(set(names))


    translator = GoogleTranslator(source="en", target="vi")
    vietnamese_list = [translator.translate(word) for word in english_list]

    return vietnamese_list, result_image_path
