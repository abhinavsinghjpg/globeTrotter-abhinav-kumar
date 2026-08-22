import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, ForeignKey, DateTime, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.shared.models import BaseModel, PlaceStatus, VerificationStatus


class Destination(BaseModel):
    __tablename__ = "destinations"

    name = Column(String(100), nullable=False, unique=True, index=True)
    state = Column(String(100), nullable=False, index=True)
    country = Column(String(100), default="India", nullable=False)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    hero_image = Column(String(500), nullable=True)
    gallery = Column(JSONB, default=list)
    best_time_to_visit = Column(String(100), nullable=True)
    is_popular = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    places = relationship("Place", back_populates="destination", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="destination", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="destination", cascade="all, delete-orphan")
    restaurants = relationship("Restaurant", back_populates="destination", cascade="all, delete-orphan")
    shops = relationship("Shop", back_populates="destination", cascade="all, delete-orphan")


class Place(BaseModel):
    __tablename__ = "places"

    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # fort, palace, temple, museum, viewpoint, park, market
    description = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(SQLEnum(PlaceStatus), default=PlaceStatus.OPEN, nullable=False)
    status_reason = Column(String(255), nullable=True)  # e.g., "Monsoon restoration until Oct"
    opening_hours = Column(JSONB, default=dict)  # {"open": "09:00", "close": "18:00", "days": "All days"}
    price_range = Column(String(50), default="₹₹")  # Free, ₹, ₹₹, ₹₹₹
    entry_fee_inr = Column(Float, default=0.0)
    rating = Column(Float, default=4.5)
    reviews_count = Column(Integer, default=0)
    is_hidden_spot = Column(Boolean, default=False, index=True)
    safety_notes = Column(Text, nullable=True)
    access_info = Column(Text, nullable=True)
    best_time_of_day = Column(String(50), default="Morning/Evening")  # Sunrise, Morning, Afternoon, Sunset, Night
    suggested_duration_mins = Column(Integer, default=90)
    photos = Column(JSONB, default=list)
    reels_urls = Column(JSONB, default=list)  # Instagram reels / video links contributed by travelers
    source = Column(String(100), default="official")
    last_verified_at = Column(DateTime, default=datetime.utcnow)
    verification_confidence = Column(Float, default=1.0)
    contributor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    destination = relationship("Destination", back_populates="places")


class Event(BaseModel):
    __tablename__ = "events"

    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False, index=True)
    category = Column(String(50), nullable=False)  # festival, cultural, music, food_fest, literature, fair
    description = Column(Text, nullable=False)
    start_date = Column(DateTime, nullable=False, index=True)
    end_date = Column(DateTime, nullable=False, index=True)
    location_name = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    ticket_price_inr = Column(Float, default=0.0)
    booking_link = Column(String(500), nullable=True)
    expected_crowd = Column(String(50), default="High")  # Low, Moderate, High, Very High
    suitable_age_groups = Column(JSONB, default=lambda: ["16-26", "26-45", "45-old age"])
    photos = Column(JSONB, default=list)
    verification_status = Column(SQLEnum(VerificationStatus), default=VerificationStatus.VERIFIED)

    destination = relationship("Destination", back_populates="events")


class Activity(BaseModel):
    __tablename__ = "activities"

    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False)  # balloon_safari, camel_ride, trekking, heritage_walk, culinary_tour
    description = Column(Text, nullable=False)
    cost_inr = Column(Float, nullable=False)
    cost_type = Column(String(30), default="verified")  # estimated, verified, user_reported
    duration_mins = Column(Integer, default=120)
    difficulty = Column(String(30), default="easy")  # easy, moderate, adventurous, challenging
    age_min = Column(Integer, default=5)
    age_max = Column(Integer, default=70)
    safety_requirements = Column(Text, nullable=True)
    best_season = Column(String(100), default="October to March")
    weather_dependency = Column(String(50), default="Clear skies required")
    provider_name = Column(String(150), nullable=True)
    booking_url = Column(String(500), nullable=True)
    photos = Column(JSONB, default=list)

    destination = relationship("Destination", back_populates="activities")


class Restaurant(BaseModel):
    __tablename__ = "restaurants"

    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(50), default="restaurant")  # street_food, cafe, fine_dining, traditional_thali
    cuisines = Column(JSONB, default=lambda: ["Rajasthani", "North Indian"])
    dietary_options = Column(JSONB, default=lambda: ["veg", "jain_available"])
    must_try_dishes = Column(JSONB, default=list)  # e.g., ["Pyaaz Kachori", "Dal Baati Churma", "Ghevar"]
    price_for_two_inr = Column(Float, default=400.0)
    rating = Column(Float, default=4.6)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(255), nullable=False)
    opening_hours = Column(JSONB, default=dict)
    photos = Column(JSONB, default=list)

    destination = relationship("Destination", back_populates="restaurants")


class Shop(BaseModel):
    __tablename__ = "shops"

    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)  # clothing, handicrafts, jewellery, blue_pottery, jootis, spices
    description = Column(Text, nullable=False)
    specialties = Column(JSONB, default=list)  # ["Bandhani sarees", "Kundan Jewellery", "Blue Pottery"]
    price_range = Column(String(50), default="₹₹")
    rating = Column(Float, default=4.5)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(255), nullable=False)
    photos = Column(JSONB, default=list)

    destination = relationship("Destination", back_populates="shops")
