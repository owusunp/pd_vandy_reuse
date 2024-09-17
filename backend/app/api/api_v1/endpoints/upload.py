# app/api/api_v1/endpoints/upload.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import List
import os
import random
import string
import boto3

router = APIRouter()

# Load AWS credentials and region from environment variables
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
region_name = os.getenv('AWS_REGION')
bucket_name = os.getenv('AWS_BUCKET_NAME')

# S3 setup
s3 = boto3.client(
    's3',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
)

def upload_image_to_s3(image_path):

    file_name = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10)) + '.jpg'

    # Upload the file to S3
    s3.upload_file(image_path, bucket_name, file_name, ExtraArgs={'ContentType': 'image/jpeg'})

    # Get the S3 URL
    url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"

    return url


@router.post("/")
async def upload_images(files: List[UploadFile] = File(...)):
    image_urls = []
    for file in files:
        temp_file_path = f"temp_{file.filename}"
        try:
            # Write the uploaded file content to the temporary file
            with open(temp_file_path, "wb") as buffer:
                buffer.write(await file.read())
            
            # Upload the temporary file to S3
            image_url = upload_image_to_s3(temp_file_path)
            image_urls.append(image_url)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
    return {"imageUrls": image_urls}