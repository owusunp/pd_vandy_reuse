# app/main.py
from fastapi import FastAPI
from app.db.session import connect_to_mongo, close_mongo_connection
from app.api.api_v1.api import api_router#Look at chat

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

app.include_router(api_router)