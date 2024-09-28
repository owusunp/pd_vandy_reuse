import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load the environment variables from the .env file
load_dotenv()

class Settings(BaseSettings):
    MONGO_CONNECTION_STRING: str = os.getenv("MONGO_CONNECTION_STRING")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")
    JWT_SECRET: str = os.getenv("JWT_SECRET")  # Add JWT_SECRET here

    class Config:
        env_file = ".env"  # Ensure .env file reading is enabled

settings = Settings()

# Validate that required settings are not empty
assert settings.MONGO_CONNECTION_STRING, "MONGO_CONNECTION_STRING must be set"
assert settings.DATABASE_NAME, "DATABASE_NAME must be set"
assert settings.JWT_SECRET, "JWT_SECRET must be set"  # Add validation for JWT_SECRET
