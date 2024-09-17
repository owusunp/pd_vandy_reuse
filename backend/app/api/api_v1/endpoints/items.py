# app/api/api_v1/endpoints/items.py
from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from app.api.api_v1.models.item import Item

# Load environment variables from .env file
load_dotenv()

# Initialize MongoDB client
client = AsyncIOMotorClient(os.getenv("MONGO_CONNECTION_STRING"))
db = client[os.getenv("DATABASE_NAME")]  # Database name
collection = db["items"]  # Collection name

router = APIRouter()

# Get all items from database
@router.get("/")
async def read_items():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])  # Convert ObjectId to string
        items.append(item)
    return items

#Create a new item
@router.post("/")
async def create_item(item: Item):
    item_dict = item.dict()
    result = await collection.insert_one(item_dict)
    if result.inserted_id:
        return {"message": "Item created successfully", "item_id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=500, detail="Item creation failed")