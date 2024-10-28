from ultralytics import YOLO

model = YOLO('D:/DATN/Source_project/app/backend/models/final_model_1.pt') 
image_path = "uploads/2.jpg"

results = model(image_path) 

# import os

# # Đường dẫn đến tệp bạn muốn kiểm tra
# file_path = 'D:/DATN/Source_project/app/backend/models/final_model_1.pt'

# # Kiểm tra xem tệp có tồn tại không
# if os.path.isfile(file_path):
#     print("Tệp tồn tại.")
# else:
#     print("Tệp không tồn tại.")

