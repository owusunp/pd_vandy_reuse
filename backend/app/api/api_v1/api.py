from fastapi import APIRouter
from app.api.api_v1.endpoints import users, items, messages
from app.api.api_v1.test_mongo import router as test_mongo_router

api_router = APIRouter()

# Include the user-related routes
api_router.include_router(users.router, prefix="/users")

# Include the item-related routes
api_router.include_router(items.router, prefix="/items")

# Include the message-related routes
api_router.include_router(messages.router, prefix="/messages")

# Include the test-mongo routes
api_router.include_router(test_mongo_router, prefix="/mongo", tags=["mongo"])