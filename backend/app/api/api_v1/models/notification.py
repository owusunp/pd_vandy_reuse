# app/api/api_v1/models/item.py
from pydantic import BaseModel
from typing import List

class Notification(BaseModel):
    poster: str
    description: str
    date_posted: str
    is_read: bool