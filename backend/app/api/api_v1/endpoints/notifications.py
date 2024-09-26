from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from app.api.api_v1.models.notification import Notification
from bson import ObjectId

# Load environment variables from .env file
load_dotenv()

# Initialize MongoDB client
client = AsyncIOMotorClient(os.getenv("MONGO_CONNECTION_STRING"))
db = client[os.getenv("DATABASE_NAME")]  # Database name
collection1 = db["sell-notifications"]  
collection2 = db["buy-notifications"] 

router = APIRouter()

# Get all items from database
@router.get("/")
async def read_items():
    buy_notifications = []
    sell_notifications = []
    async for notification in collection1.find():
        notification["_id"] = str(notification["_id"])  # Convert ObjectId to string
        sell_notifications.append(notification)
    async for notification in collection2.find():
        notification["_id"] = str(notification["_id"])  # Convert ObjectId to string
        buy_notifications.append(notification)

    return {"buy_notifications": buy_notifications, "sell_notifications": sell_notifications}

# Create a new buy notification
@router.post("/buy_notification")
async def create_buy_notification(notification: Notification):
    item_dict = notification.dict()
    result = await collection2.insert_one(item_dict)
    if result.inserted_id:
        return str(result.inserted_id)
    else:
        raise HTTPException(status_code=500, detail="Item creation failed")
    
# Create a new sell notification
@router.post("/sell_notification")
async def create_sell_notification(notification: Notification):
    item_dict = notification.dict()
    result = await collection1.insert_one(item_dict)
    if result.inserted_id:
        return str(result.inserted_id)
    else:
        raise HTTPException(status_code=500, detail="Item creation failed")

# Update notification status to read
@router.put("/{notification_id}")
async def update_notification(notification_id: str, notification: Notification):
    notification_dict = notification.dict()
    notification_dict.pop("_id", None)  # Remove '_id' if it exists
    if ObjectId.is_valid(notification_id):
        # Check if the notification is in the buy-notifications collection
        result = await collection2.update_one({"_id": ObjectId(notification_id)}, {"$set": notification_dict})
        if result.modified_count == 1:
            return {"msg": "Notification updated successfully"}
        
        # If not found in buy-notifications, check in sell-notifications
        result = await collection1.update_one({"_id": ObjectId(notification_id)}, {"$set": notification_dict})
        if result.modified_count == 1:
            return {"msg": "Notification updated successfully"}
        
        raise HTTPException(status_code=404, detail="Notification not found")
    else:
        raise HTTPException(status_code=400, detail="Invalid notification ID")