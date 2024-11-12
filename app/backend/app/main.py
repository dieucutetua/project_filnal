from fastapi import FastAPI
from routers import user, food, suggestions

app = FastAPI()

# Kết nối các router
app.include_router(user.router)
app.include_router(food.router)
app.include_router(suggestions.router)

# @app.get("/")
# async def root():
#     return {"message": "Hello, World!"}


























# from fastapi import FastAPI, UploadFile, File
# import os
# from ultralytics import YOLO
# from PIL import Image
# import io
# from hashlib import sha256
# from datetime import datetime
# import imghdr
# from fastapi import FastAPI, HTTPException
# from app.models.modelUser import UserCreate, UserLogin, User
# from crud import create_user, get_user_by_email, verify_password

# app = FastAPI()

# UPLOAD_FOLDER = "uploads/images"

# # model = YOLO('D:/DATN/Source_project/app/backend/models/best_model.pt') 
# model = YOLO("D:/DATN/Source_project/app/backend/models/best_model.pt")  # Hoặc "last.pt" nếu bạn muốn dùng trọng số từ epoch cuối
# # model.eval()

# @app.post("/")
# async def upload_image(files: list[UploadFile] = File(...)):

#     # Lấy thời gian hiện tại để tạo thư mục riêng cho lần upload này
#     current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
#     time_folder = os.path.join(UPLOAD_FOLDER, current_time)
#     os.makedirs(time_folder, exist_ok=True)

#     upload_images_file = []
#     names = []

#     for file in files:
#         image_data = await file.read()
#         image_stream = io.BytesIO(image_data)

#         # Kiểm tra xem tệp có phải là ảnh không
#         if not imghdr.what(image_stream):
#             return {"error": f"{file.filename} is not a valid image file."}

#         image = Image.open(image_stream)

#         file_path = os.path.join(time_folder, file.filename)
#         image.save(file_path)
#         upload_images_file.append(file.filename)

     
#         results = model(file_path)  #  model.predict(file_path) n
#         for result in results:
#             for detection in result.boxes:
#                 class_id = int(detection.cls)
#                 class_name = model.names[class_id]
#                 names.append(class_name)

   
#     return {"info": f"Files saved at '{time_folder}'", "detected_items": list(set(names))}
    




# # @app.get("/Recog")
# # async def getname_image():
# #     image_path = "uploads/images"
# #     results = model(image_path)
# #     names = []
    
# #     # Lưu kết quả nhận diện vào một danh sách để bổ sung nếu có ảnh mới
# #     for result in results:
# #         for detection in result.boxes:
# #             class_id = int(detection.cls)
# #             class_name = model.names[class_id]
# #             names.append(class_name)
    
# #     # Trả về danh sách các thực phẩm đã nhận diện
# #     return {"detected_items": list(set(names))}


# # @app.post("/Recog")
# # async def getname_image(file: UploadFile):
# #     image = Image.open(io.BytesIO(await file.read())).convert("RGB")

# #     # image_path = "uploads/2.jpg"
# #     results = model(image)
# #     names =[]
# #     for result in results:
# #         for detection in result.boxes:
# #             class_id = int(detection.cls)  
# #             class_name = model.names[class_id]  
# #             names.append(class_name)
# #     return {"detected_items": list(set(names))}


# #id_user
# # @app.post("/")
# # async def upload_image(
# #     files: list[UploadFile] = File(...),
# #     user: dict = Depends(get_current_user)
# # ):
# #     user_id = user["user_id"]
# #     user_folder = os.path.join(UPLOAD_FOLDER, user_id)
# #     os.makedirs(user_folder, exist_ok=True)
    
# #     uploaded_files = []
    
# #     for file in files:
# #         image_data = await file.read()
# #         image_stream = io.BytesIO(image_data)
# #         image = Image.open(image_stream)
        
# #         file_path = os.path.join(user_folder, file.filename)
# #         image.save(file_path)
# #         uploaded_files.append(file.filename)
        
# #     return {"info": f"Files saved for user '{user_id}'", "files": uploaded_files}