from pydantic import BaseSettings

class Settings(BaseSettings):
    MONGO_CONNECTION_STRING: str = "mongodb+srv://tamehdave:Davejunior11@marketplacecluster.y49pm.mongodb.net/"
    DATABASE_NAME: str = "vu_marketplace"

settings = Settings()

