import json
from pymongo import MongoClient

# Kết nối tới MongoDB
client = MongoClient("mongodb://localhost:27017/")  
db = client['DATN'] 
collection = db['recipes_collection'] 

with open('db-recipes.json', 'r') as file:
    data = json.load(file)


recipes = [value for key, value in data.items()]


collection.insert_many(recipes)

print("Dữ liệu đã được lưu vào MongoDB.")
