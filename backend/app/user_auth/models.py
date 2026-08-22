import uuid
from datetime import datetime, timedelta
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.shared.models import BaseModel, Role, AgeGroup, TravelStyle, BudgetLevel


class User(BaseModel):
    __tablename__ = "users"

    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=True)  # Nullable for OAuth-only users
    role = Column(SQLEnum(Role), default=Role.TRAVELLER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    auth_provider = Column(String(50), default="local")  # local, google

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    password_resets = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")


class UserProfile(BaseModel):
    __tablename__ = "user_profiles"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    age_group = Column(SQLEnum(AgeGroup), default=AgeGroup.ADULT, nullable=False)
    travel_style = Column(SQLEnum(TravelStyle), default=TravelStyle.SOLO, nullable=False)
    budget_level = Column(SQLEnum(BudgetLevel), default=BudgetLevel.STANDARD, nullable=False)
    interests = Column(JSONB, default=list)  # ["culture", "food", "heritage", "adventure"]
    food_preferences = Column(JSONB, default=list)  # ["veg", "jain", "street_food"]
    accommodation_preference = Column(String(50), default="hotel")
    preferred_transportation = Column(String(50), default="public_and_cab")
    activity_intensity = Column(String(50), default="moderate")  # relaxed, moderate, high
    accessibility_requirements = Column(JSONB, default=list)
    preferred_language = Column(String(50), default="English")
    traveller_type = Column(String(50), default="solo")  # solo, couple, family, group, business

    user = relationship("User", back_populates="profile")


class PasswordResetToken(BaseModel):
    __tablename__ = "password_reset_tokens"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="password_resets")
