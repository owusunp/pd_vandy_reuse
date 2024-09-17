# app/api/api_v1/models/item.py
from pydantic import BaseModel
from typing import List
from datetime import date

class Item(BaseModel):
    name: str
    description: str
    vendor: str
    price: str
    list_of_images: List[str]
    date_posted: str
    sold: bool
    category: str