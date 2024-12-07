Cài đặt và chạy dự án

1. Frontend (ReactJS)
   Bước 1: Cài đặt các thư viện cần thiết
   cd frontend
   npm install
   Bước 2: Chạy frontend
   npm start
   Frontend sẽ chạy trên http://localhost:3000.

2. Backend (FastAPI)
   Bước 1: Tạo và kích hoạt môi trường ảo
   Windows:
   python -m venv venv
   .\venv\Scripts\activate
   Mac/Linux:
   python -m venv venv
   source venv/bin/activate
   Bước 2: Cài đặt các thư viện từ requirements.txt
   Mở môi trường và cài đặt các thư viện cần thiết:
   pip install -r requirements.txt
   Bước 3: Chạy backend:
   Trỏ đến project_filnal\app\backend\app rồi chạy lệnh:
   uvicorn main:app --reload
   Backend sẽ chạy trên http://127.0.0.1:8000/docs.

3. Cơ sở dữ liệu (MongoDB)
   Bước 1: Cài đặt MongoDb
   Dowload MongoCompass : https://downloads.mongodb.com/compass/mongodb-compass-1.45.0-win32-x64.exe
   MongoDB Community Server : https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.0.4-signed.msi
   Bước 2: Cấu hình cơ sở dữ liệu trong MongoCompass
   Kết nối MongoDB thông qua MongoCompass:
   Đảm bảo địa chỉ mặc định là mongodb://localhost:27017.
   Bước 3: Kiểm tra kết nối
   Backend sẽ tự động kết nối với MongoDB khi chạy MongoCompass và connect thành công

//.gitmore(chỉ có file .env - với nội dung OPENAI_API_KEY)
