
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_CONNECTION_STRING: str = "mongodb+srv://tamehdave:Davejunior11@marketplacecluster.y49pm.mongodb.net/?retryWrites=true&appName=MarketplaceCluster&ssl=true"

    DATABASE_NAME: str = "vu_marketplace"

    class Config:
        env_file = None  # Disable .env file reading

settings = Settings()

# Validate that required settings are not empty
assert settings.MONGO_CONNECTION_STRING, "MONGO_CONNECTION_STRING must be set"
assert settings.DATABASE_NAME, "DATABASE_NAME must be set"

