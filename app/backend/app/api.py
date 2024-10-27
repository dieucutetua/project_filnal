from fastapi import FastAPI, File, UploadFile
import shutil

app = FastAPI()

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    with open(f"uploads/{file.filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename}
