# app/api/api_v1/endpoints/users.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_users():
    return {"message": "List of users"}