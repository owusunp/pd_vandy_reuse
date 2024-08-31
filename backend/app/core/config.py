from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_CONNECTION_STRING: str = "mongodb+srv://tamehdave:Davejunior11@marketplacecluster.y49pm.mongodb.net/vu_marketplace?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"

    DATABASE_NAME: str = "vu_marketplace"

settings = Settings()

