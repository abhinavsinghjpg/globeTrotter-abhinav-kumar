import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.shared.models import PlaceStatus, VerificationStatus


class DestinationRead(BaseModel):
    id: uuid.UUID
    name: str
    state: str
    country: str
    tagline: Optional[str] = None
    description: str
    latitude: float
    longitude: float
    hero_image: Optional[str] = None
    gallery: List[str] = []
    best_time_to_visit: Optional[str] = None
    is_popular: bool = False

    class Config:
        from_attributes = True


class PlaceRead(BaseModel):
    id: uuid.UUID
    destination_id: uuid.UUID
    name: str
    category: str
    description: str
    latitude: float
    longitude: float
    status: PlaceStatus
    status_reason: Optional[str] = None
    opening_hours: Dict[str, Any] = {}
    price_range: str
    entry_fee_inr: float
    rating: float
    reviews_count: int
    is_hidden_spot: bool
    safety_notes: Optional[str] = None
    access_info: Optional[str] = None
    best_time_of_day: str
    suggested_duration_mins: int
    photos: List[str] = []
    reels_urls: List[str] = []
    source: str
    last_verified_at: datetime
    verification_confidence: float

    class Config:
        from_attributes = True


class EventRead(BaseModel):
    id: uuid.UUID
    destination_id: uuid.UUID
    name: str
    category: str
    description: str
    start_date: datetime
    end_date: datetime
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    ticket_price_inr: float
    booking_link: Optional[str] = None
    expected_crowd: str
    suitable_age_groups: List[str] = []
    photos: List[str] = []
    verification_status: VerificationStatus

    class Config:
        from_attributes = True


class ActivityRead(BaseModel):
    id: uuid.UUID
    destination_id: uuid.UUID
    name: str
    category: str
    description: str
    cost_inr: float
    cost_type: str
    duration_mins: int
    difficulty: str
    age_min: int
    age_max: int
    safety_requirements: Optional[str] = None
    best_season: str
    weather_dependency: str
    provider_name: Optional[str] = None
    booking_url: Optional[str] = None
    photos: List[str] = []

    class Config:
        from_attributes = True


class RestaurantRead(BaseModel):
    id: uuid.UUID
    destination_id: uuid.UUID
    name: str
    category: str
    cuisines: List[str] = []
    dietary_options: List[str] = []
    must_try_dishes: List[str] = []
    price_for_two_inr: float
    rating: float
    latitude: float
    longitude: float
    address: str
    opening_hours: Dict[str, Any] = {}
    photos: List[str] = []

    class Config:
        from_attributes = True


class ShopRead(BaseModel):
    id: uuid.UUID
    destination_id: uuid.UUID
    name: str
    category: str
    description: str
    specialties: List[str] = []
    price_range: str
    rating: float
    latitude: float
    longitude: float
    address: str
    photos: List[str] = []

    class Config:
        from_attributes = True


class NearbySearchResponse(BaseModel):
    current_location: Dict[str, float]
    nearby_places: List[PlaceRead] = []
    nearby_restaurants: List[RestaurantRead] = []
    nearby_shops: List[ShopRead] = []
    nearby_events: List[EventRead] = []
