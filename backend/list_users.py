from stream_chat import StreamChat
import os

# Load environment variables (if needed)
from dotenv import load_dotenv

load_dotenv()

# Replace with your Stream API key and secret
api_key = os.getenv("STREAM_API_KEY")
api_secret = os.getenv("STREAM_API_SECRET")

# In
# itialize the StreamChat client

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
client = StreamChat(api_key=api_key, api_secret=api_secret)

def list_all_user_ids():
    try:
        # Querying users (no filters applied to get all users)
        response = client.query_users({})
        
        # Extract and print the user IDs
        user_ids = [user['id'] for user in response['users']]
        print("List of User IDs:")
        for user_id in user_ids:
            print(user_id)
            
        return user_ids

    except Exception as e:
        print(f"Error fetching users: {e}")

if __name__ == "__main__":
    # Call the function to list all user IDs
    list_all_user_ids()
