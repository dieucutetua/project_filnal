from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr  = "ltd@email.com"
    password: str


class UserLogin(BaseModel):
    email: EmailStr  = "ltd@email.com"
    password: str


class User(BaseModel):
    user_id: str
    username: str
    password: str
    email: EmailStr  = "ltd@email.com"
    created_at: datetime
    updated_at: datetime
