# app/main.py
from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db.session import connect_to_mongo, close_mongo_connection
from app.api.api_v1.api import api_router#Look at chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

#End point regisration
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)