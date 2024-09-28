from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db.session import connect_to_mongo, close_mongo_connection
from api.api_v1.endpoints.auth import router as auth_router  # Updated import for auth router
from api.api_v1.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

# Allow CORS for specific origins (development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Endpoint registration for authentication and other APIs
app.include_router(auth_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
