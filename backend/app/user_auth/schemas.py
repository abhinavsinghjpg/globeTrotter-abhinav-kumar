import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from app.shared.models import Role, AgeGroup, TravelStyle, BudgetLevel


# Auth Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6, max_length=100)
    role: Optional[Role] = Role.TRAVELLER


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    credential: str  # Google ID token or OAuth access token
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6, max_length=100)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserRead"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# Profile Schemas
class UserProfileBase(BaseModel):
    age_group: AgeGroup = AgeGroup.ADULT
    travel_style: TravelStyle = TravelStyle.SOLO
    budget_level: BudgetLevel = BudgetLevel.STANDARD
    interests: List[str] = ["culture", "food", "heritage"]
    food_preferences: List[str] = ["veg"]
    accommodation_preference: str = "hotel"
    preferred_transportation: str = "cab"
    activity_intensity: str = "moderate"
    accessibility_requirements: List[str] = []
    preferred_language: str = "English"
    traveller_type: str = "solo"


class UserProfileUpdate(BaseModel):
    age_group: Optional[AgeGroup] = None
    travel_style: Optional[TravelStyle] = None
    budget_level: Optional[BudgetLevel] = None
    interests: Optional[List[str]] = None
    food_preferences: Optional[List[str]] = None
    accommodation_preference: Optional[str] = None
    preferred_transportation: Optional[str] = None
    activity_intensity: Optional[str] = None
    accessibility_requirements: Optional[List[str]] = None
    preferred_language: Optional[str] = None
    traveller_type: Optional[str] = None


class UserProfileRead(UserProfileBase):
    id: uuid.UUID
    user_id: uuid.UUID

    class Config:
        from_attributes = True


# User Read/Update
class UserRead(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: Role
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    auth_provider: str
    created_at: datetime
    profile: Optional[UserProfileRead] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
