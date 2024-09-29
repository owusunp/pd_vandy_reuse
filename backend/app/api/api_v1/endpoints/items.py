from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId  # Import ObjectId to handle MongoDB IDs
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

# Get all items from the database
@router.get("/")
async def read_items():
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])  # Convert ObjectId to string
        items.append(item)
    return items

# Create a new item
@router.post("/")
async def create_item(item: Item):
    item_dict = item.dict()
    result = await collection.insert_one(item_dict)
    if result.inserted_id:
        return str(result.inserted_id)
    else:
        raise HTTPException(status_code=500, detail="Item creation failed")

# Delete an item by ID
@router.delete("/{item_id}")
async def delete_item(item_id: str):
    result = await collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 1:
        return {"status": "Item deleted"}
    else:
        raise HTTPException(status_code=404, detail="Item not found")

# Patch to toggle the sold status
@router.patch("/{item_id}")
async def toggle_sold_status(item_id: str):
    item = await collection.find_one({"_id": ObjectId(item_id)})
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Toggle status between 'sold' and 'available'
    new_status = "available" if item.get("status") == "sold" else "sold"
    
    result = await collection.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": {"status": new_status}}
    )
    
    if result.modified_count == 1:
        return {"status": new_status}  # Return the updated status
    else:
        raise HTTPException(status_code=500, detail="Failed to update item status")
