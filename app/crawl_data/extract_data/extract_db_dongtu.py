import spacy
from pymongo import MongoClient

nlp = spacy.load("en_core_web_sm")


client = MongoClient("mongodb://localhost:27017/")
db = client["DATN"]
recipes_collection = db["recipes_collection"]


def filter_ingredients(ingredients):
    filtered_ingredients = []
    for ingredient in ingredients:
        doc = nlp(ingredient)
       
        if not any(token.pos_ == "VERB" for token in doc):
            filtered_ingredients.append(ingredient)
    return filtered_ingredients


def get_recipes_without_verbs():
    recipes_cursor = recipes_collection.find()  
    recipes = []

    for recipe in recipes_cursor:
      
        nor_ingredients = recipe.get("nor_ingredients", [])
        filtered_ingredients = filter_ingredients(nor_ingredients)  
        if filtered_ingredients: 
            
            recipes_collection.update_one(
                {"_id": recipe["_id"]},
                {"$set": {"nor_ingredients": filtered_ingredients}},
            )
        
            recipe["nor_ingredients"] = filtered_ingredients
            recipes.append(recipe)
    
    return recipes


recipes = get_recipes_without_verbs()


for recipe in recipes:
    print(f"Recipe ID: {recipe['_id']}")
    print(f"Title: {recipe['title']}")
    print(f"Nor Ingredients (Filtered): {recipe['nor_ingredients']}")
    print("-" * 40)
