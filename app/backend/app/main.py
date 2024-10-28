from fastapi import FastAPI, UploadFile, File
import os

app = FastAPI()

# Đường dẫn tới thư mục uploads
UPLOAD_FOLDER = "uploads"

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    # Lưu file vào thư mục uploads
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())
    return {"info": f"File '{file.filename}' saved at '{file_location}'"}
