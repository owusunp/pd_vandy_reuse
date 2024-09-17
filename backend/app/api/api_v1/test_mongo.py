import sys
import boto3
from motor.motor_asyncio import AsyncIOMotorClient
import random
import os
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from pydantic_settings import BaseSettings
import string
from dotenv import load_dotenv
from bson import ObjectId
# Add the project root to PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from app.core.config import settings

load_dotenv()

# Initialize MongoDB client
client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING)
db = client[settings.DATABASE_NAME]  # Database name
collection = db["items"]  # Collection name


# Load AWS credentials and region from environment variables
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
region_name = os.getenv('AWS_REGION')

# S3 setup
s3 = boto3.client(
    's3',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
)
bucket_name = 'tameh-dave-bucket'

# Function to upload a random image to S3 and return the URL
def upload_image_to_s3(image_path):

    file_name = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10)) + '.jpg'

# Construct the absolute path to the image
    current_directory = os.path.dirname(os.path.abspath(__file__))
    relative_image_path = os.path.join(current_directory, image_path)

    # Create a temporary image file (for demo purposes, you can replace this with actual images)
    with open(relative_image_path, 'rb') as source_file:
        with open(file_name, 'wb') as destination_file:
            destination_file.write(source_file.read())
            print(f"File uploaded successfully to {destination_file}")

    # Upload the file to S3
    s3.upload_file(file_name, bucket_name, file_name, ExtraArgs={'ContentType': 'image/jpeg'})

    # Get the S3 URL
    url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"

    # Delete the local file after uploading
    os.remove(file_name)

    return url

# Function to generate a random item and insert it into MongoDB
async def generate_random_item(image_path):
    item = {
        "name": "Couch",
        "description": "Best couch you'll find",
        "vendor": "Davis Tameh-Nfon",
        "price": round(random.uniform(10, 1000), 2),
        "list_of_images": [upload_image_to_s3(image_path)],
        "date_posted": "2024-01-01",
        "sold": random.choice([True, False])
    }
    await collection.insert_one(item)

async def delete_item_and_image(item_id):
    print(f"Attempting to delete item with ID: {item_id}")
    try:
        # Convert the string ID to ObjectId
        object_id = ObjectId(item_id)
    except Exception as e:
        print(f"Invalid item ID: {item_id}. Error: {e}")
        return

    item = await collection.find_one({"_id": object_id})
    if item:
        print(f"Item found: {item}")
        # Iterate over each image URL in the list_of_images
        for image_url in item["list_of_images"]:
            # Extract the S3 key from the image URL
            s3_key = image_url.split('/')[-1]

            # Delete the image from S3
            s3.delete_object(Bucket=bucket_name, Key=s3_key)
            print(f"Deleted {s3_key} from S3")

         # Delete the item from MongoDB
        delete_result = await collection.delete_one({"_id": object_id})
        if delete_result.deleted_count == 1:
            print(f"Deleted item {item_id} from MongoDB")
        else:
            print(f"Failed to delete item {item_id} from MongoDB")
    else:
        print(f"No item found with ID: {item_id}")


# Function to generate 50 random items
async def populate_items():
    #await generate_random_item(image_path)
    await delete_item_and_image("66e9101f050a6d5830c30ad5")

# Run the script
import asyncio
if __name__ == "__main__":
    asyncio.run(populate_items())