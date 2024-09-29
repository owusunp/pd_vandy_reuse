from fastapi import APIRouter
from app.api.api_v1.endpoints import users, items, messages, upload, notifications

api_router = APIRouter()

# Include the user-related routes
api_router.include_router(users.router, prefix="/users", tags=["users"])

# Include the item-related routes
api_router.include_router(items.router, prefix="/items", tags=["items"])

# Include the message-related routes
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])

# Include the upload-related routes
api_router.include_router(upload.router, prefix="/upload", tags=["uploads"])

# Include the notification-related routes
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])

