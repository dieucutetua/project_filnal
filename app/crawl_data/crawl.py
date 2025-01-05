import pandas as pd
from pymongo import MongoClient


df = pd.read_csv("./crawl_data/RAW_recipes.csv")



client = MongoClient("mongodb://localhost:27017/")  
db = client['DATN'] 
collection = db['recipes_collection']  #


filtered_data = df[['name', 'steps', 'description', 'ingredients']]


for _, row in filtered_data.iterrows():
    recipe = {
        "name": row['name'],
        "steps": row['steps'],
        "description": row['description'],
        "ingredients": row['ingredients']
    }
    # Lưu vào MongoDB
    collection.insert_one(recipe)

print("Dữ liệu đã được lưu vào MongoDB.")
