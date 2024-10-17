from fastapi import FastAPI, File, UploadFile
import shutil
from pathlib import Path


# Khởi tạo ứng dụng FastAPI
app = FastAPI()

# Định nghĩa thư mục để lưu ảnh tải lên
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Route để upload ảnh
@app.post("/uploadfile/")
async def upload_image(file: UploadFile = File(...)):
    file_location = UPLOAD_DIR / file.filename
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"filename": file.filename, "message": "Upload successful"}