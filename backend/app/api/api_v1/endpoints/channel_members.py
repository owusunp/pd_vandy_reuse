from stream_chat import StreamChat
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize your Stream client
STREAM_API_KEY = os.getenv("STREAM_API_KEY")
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")

stream_client = StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

# Function to list all users in your Stream account
def list_users():
    try:
        # Fetch all users with an empty filter
        users = stream_client.query_users(filter_conditions={})
        print("Stream.io Members:")
        for user in users['users']:
            print(f"User ID: {user['id']}, Name: {user.get('name', 'N/A')}")
    except Exception as e:
        print(f"Error fetching users: {e}")

if __name__ == "__main__":
    list_users()
