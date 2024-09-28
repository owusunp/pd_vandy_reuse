from stream_chat import StreamChat

# Replace with your API key and secret
api_key = "wh9yrcrxaqss"
api_secret = "cqkmutnzs62cb9eqsnn24c6zvyem7m63uu6d37hbmr2s5vxvzyhsdubzcdze9muu"
client = StreamChat(api_key=api_key, api_secret=api_secret)

def generate_token(user_id):
    return client.create_token(user_id)

# Example usage
if __name__ == "__main__":
    user_id = "owusunp"  # Replace with the user ID you want to generate a token for
    token = generate_token(user_id)
    print(f"Generated token for {user_id}: {token}")
