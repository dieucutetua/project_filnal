from ultralytics import YOLO

# Sử dụng mô hình YOLOv8n từ thư mục models
model = YOLO('backend/yolov8/yolov8n.pt')

# Huấn luyện hoặc dự đoán với mô hình
model.train(data='backend/FOOD-2/data.yaml', epochs=100, imgsz=640) 
# import os

# print(os.path.exists('backend/FOOD-2/data.yaml'))  
