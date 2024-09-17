import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):

    MONGO_CONNECTION_STRING: str = os.getenv("MONGO_CONNECTION_STRING")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")

    class Config:
        env_file = None  # Disable .env file reading

settings = Settings()

# Validate that required settings are not empty
assert settings.MONGO_CONNECTION_STRING, "MONGO_CONNECTION_STRING must be set"
assert settings.DATABASE_NAME, "DATABASE_NAME must be set"

