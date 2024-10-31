from ultralytics import YOLO


model = YOLO('D:/DATN/Source_project/app/backend/models/final_model_1.pt') 
results = model.predict("D:/DATN/Source_project/app/backend\FOOD-2/test/images", save=True, conf=0.5)