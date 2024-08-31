# app/api/api_v1/endpoints/items.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_items():
    return {"message": "List of items"}