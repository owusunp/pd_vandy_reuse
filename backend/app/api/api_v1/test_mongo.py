# app/api/api_v1/test_mongo.py
from fastapi import APIRouter
from app.db.session import db
from app.core.config import settings

router = APIRouter()

@router.get("/test-mongo")
async def test_mongo():
    collection = db.client[settings.DATABASE_NAME]["test_collection"]
    document = {"test_key": "test_value"}
    await collection.insert_one(document)
    return {"message": "Successfully inserted a document in MongoDB!"}