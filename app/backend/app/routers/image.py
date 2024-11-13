import os
from datetime import datetime
from PIL import Image
import io
import imghdr
from crud import save_image_info_to_db

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
