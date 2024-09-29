from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from backend.app.api.api_v1.models.request import Request, Reply

class Reply(BaseModel):
    poster: str
    message: str
    date_posted: datetime

class Request(BaseModel):
    poster: str
    description: str
    date_posted: datetime
    replies: Optional[List[Reply]] = []
