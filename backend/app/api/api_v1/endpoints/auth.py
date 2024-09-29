# auth.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from stream_chat import StreamChat

# Load environment variables from .env file
load_dotenv()

STREAM_API_KEY = os.getenv("STREAM_API_KEY")
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")
MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Ensure required environment variables are present
if not STREAM_API_KEY or not STREAM_API_SECRET:
    raise Exception("STREAM_API_KEY and STREAM_API_SECRET must be set in .env file")

if not MONGO_CONNECTION_STRING or not DATABASE_NAME:
    raise Exception("MONGO_CONNECTION_STRING and DATABASE_NAME must be set in .env file")

# Initialize password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Initialize MongoDB client
client = MongoClient(MONGO_CONNECTION_STRING)
db = client[DATABASE_NAME]
users_collection = db["users"]
sessions_collection = db["sessions"]  # Collection to track logged-in users

# Initialize Stream Chat client
stream_client = StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

# Define FastAPI router for authentication-related routes
router = APIRouter()

# Define the model for the user registration request
class UserRegister(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register_user(user: UserRegister):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = pwd_context.hash(user.password)
    new_user = {"username": user.username, "password": hashed_password}
    result = users_collection.insert_one(new_user)

    # Create or update a Stream user
    stream_client.upsert_user({
        'id': user.username,
        'name': user.username,
        'image': 'https://path/to/avatar.jpg'  # Replace with an actual image URL if needed
    })

    return {"message": "User created successfully", "user_id": str(result.inserted_id)}

# Define the model for the user login request
class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login_user(user: UserLogin):
    # Find the user in the MongoDB database
    existing_user = users_collection.find_one({"username": user.username})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    # Verify the password
    if not pwd_context.verify(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    # Generate a Stream Chat token for the user
    token = generate_token(user.username)
    
    # Check if the user is already logged in (session exists)
    existing_session = sessions_collection.find_one({"username": user.username})
    if not existing_session:
        # Save the logged-in user in the session (store in MongoDB)
        session_data = {"username": user.username, "token": token}
        sessions_collection.insert_one(session_data)
    
    return {
        "message": "Login successful",
        "username": user.username,
        "streamToken": token
    }

@router.post("/logout")
async def logout_user(user: UserLogin):
    # Remove the user from the session collection
    deleted_session = sessions_collection.delete_one({"username": user.username})
    
    if deleted_session.deleted_count == 0:
        raise HTTPException(status_code=400, detail="User is not logged in")
    
    return {"message": "Logout successful"}

# Get the currently logged-in users
@router.get("/logged-in-users")
async def get_logged_in_users():
    active_sessions = sessions_collection.find({})
    logged_in_users = [session["username"] for session in active_sessions]
    return {"logged_in_users": logged_in_users}

def generate_token(user_id):
    """Generate a Stream Chat token for the specified user ID."""
    return stream_client.create_token(user_id)
