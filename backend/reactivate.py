from stream_chat import StreamChat
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the API key and secret from environment variables
STREAM_API_KEY = os.getenv("STREAM_API_KEY")
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")

# Initialize the StreamChat client
client = StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

# Function to reactivate a user
def reactivate_user(user_id):
    try:
        # Reactivate the user
        client.reactivate_user(user_id)
        print(f"User '{user_id}' reactivated successfully.")
    except Exception as e:
        print(f"Error reactivating user '{user_id}': {e}")

if __name__ == "__main__":
    # User ID of the deleted user
    user_id = "davistameh"

    # Reactivate the user
    reactivate_user(user_id)
