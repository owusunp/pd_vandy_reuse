from fastapi import APIRouter
from app.api.api_v1.endpoints import users, items, messages, upload

api_router = APIRouter()

# Include the user-related routes
api_router.include_router(users.router, prefix="/users")

# Include the item-related routes
api_router.include_router(items.router, prefix="/items")

# Include the message-related routes
api_router.include_router(messages.router, prefix="/messages")

# Include the upload-related routes 
api_router.include_router(upload.router, prefix="/upload")
