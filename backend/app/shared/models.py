import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import Column, DateTime, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Role(str, Enum):
    TRAVELLER = "traveller"
    CONTRIBUTOR = "contributor"
    GUIDE = "guide"
    MODERATOR = "moderator"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class AgeGroup(str, Enum):
    YOUTH = "16-26"
    ADULT = "26-45"
    MATURE = "45-old age"


class TravelStyle(str, Enum):
    BUDGET = "budget"
    BACKPACKER = "backpacker"
    SOLO = "solo"
    COUPLE = "couple"
    FAMILY = "family"
    BUSINESS = "business"
    LUXURY = "luxury"
    ADVENTURE = "adventure"


class BudgetLevel(str, Enum):
    BUDGET = "budget"
    ECONOMY = "economy"
    STANDARD = "standard"
    PREMIUM = "premium"
    LUXURY = "luxury"
    CUSTOM = "custom"


class PlaceStatus(str, Enum):
    OPEN = "Open"
    CLOSED = "Closed"
    TEMPORARILY_CLOSED = "Temporarily Closed"
    UNDER_MAINTENANCE = "Under Maintenance"
    RENOVATION = "Renovation"
    EVENT_RESTRICTED = "Event Restricted"
    CHANGED_HOURS = "Changed Hours"
    UNKNOWN = "Unknown"


class VerificationStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"
    FLAGGED = "flagged"


class BaseModel(Base):
    __abstract__ = True

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
