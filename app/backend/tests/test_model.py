from ultralytics import YOLO


model = YOLO('D:/DATN/Source_project/app/backend/models/final_model_1.pt') 
results = model.predict("D:/DATN/Source_project/app/backend\FOOD-2/test/images", save=True, conf=0.5)

# Tải mô hình tốt nhất (best.pt)
model = torch.load("best.pt")
model.eval()  # Chuyển mô hình về chế độ đánh giá (evaluation mode)
