import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from pydantic_settings import BaseSettings
# Add the project root to PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from app.core.config import settings

# Initialize MongoDB client
client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)
db = client[settings.DATABASE_NAME]  # Database name
collection = db["items"]  # Collection name

async def insert_document():
    try:
        document = {"test_key": "test_value"}
        result = await collection.insert_one(document)
        print(f"Inserted document with id: {result.inserted_id}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Run the function
if __name__ == "__main__":
    asyncio.run(insert_document())
