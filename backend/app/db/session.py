from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os

# Add the project root to PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)
    print("Connected to MongoDB")

async def close_mongo_connection():
    db.client.close()
    print("Disconnected from MongoDB")