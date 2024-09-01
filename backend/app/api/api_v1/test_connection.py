from pymongo import MongoClient
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_CONNECTION_STRING: str = "mongodb+srv://tamehdave:Davejunior11@marketplacecluster.y49pm.mongodb.net/vu_marketplace?retryWrites=true&w=majority&appName=MarketplaceCluster" 
    DATABASE_NAME: str = "vu_marketplace"

    class Config:
        env_file = None

settings = Settings()

client = MongoClient(settings.MONGO_CONNECTION_STRING)
db = client[settings.DATABASE_NAME]

try:
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")