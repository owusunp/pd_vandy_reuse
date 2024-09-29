from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from backend.app.api.api_v1.models.request import Request, Reply
from datetime import datetime
import os

router = APIRouter()
client = AsyncIOMotorClient(os.getenv("MONGO_CONNECTION_STRING"))
db = client[os.getenv("DATABASE_NAME")]
collection = db["requests"]

@router.get("/requests")
async def get_requests():
    requests = []
    async for request in collection.find():
        request["_id"] = str(request["_id"])
        requests.append(request)
    return requests

@router.post("/requests")
async def create_request(request: Request):
    request_dict = request.dict()
    result = await collection.insert_one(request_dict)
    return str(result.inserted_id)

@router.post("/requests/{request_id}/reply")
async def post_reply(request_id: str, reply: Reply):
    reply_dict = reply.dict()
    result = await collection.update_one(
        {"_id": ObjectId(request_id)},
        {"$push": {"replies": reply_dict}}
    )
    if result.modified_count == 1:
        return {"status": "Reply added"}
    raise HTTPException(status_code=404, detail="Request not found")
