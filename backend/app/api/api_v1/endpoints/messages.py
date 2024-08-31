# app/api/api_v1/endpoints/messages.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_messages():
    return {"message": "List of messages"}