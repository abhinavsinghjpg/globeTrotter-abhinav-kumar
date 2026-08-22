import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.shared.models import Role, PlaceStatus, VerificationStatus


class AdminOverviewStats(BaseModel):
    total_users: int
    total_destinations: int
    total_places: int
    total_events: int
    total_restaurants: int
    open_places_count: int
    temporarily_closed_count: int
    pending_verifications_count: int


class PlaceStatusUpdate(BaseModel):
    status: PlaceStatus
    status_reason: Optional[str] = None
    verification_confidence: Optional[float] = 1.0


class UserSuspendRequest(BaseModel):
    is_active: bool
    reason: Optional[str] = None


class UserRoleUpdate(BaseModel):
    role: Role
