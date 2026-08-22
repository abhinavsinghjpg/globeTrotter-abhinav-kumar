import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.discovery.models import Destination, Place, Event, Activity, Restaurant, Shop
from app.discovery.schemas import (
    DestinationRead,
    PlaceRead,
    EventRead,
    ActivityRead,
    RestaurantRead,
    ShopRead,
    NearbySearchResponse,
)
from app.discovery.service import (
    get_all_destinations,
    get_destination_by_name_or_id,
    get_places_by_destination,
    get_nearby_entities,
)

router = APIRouter(prefix="/discovery", tags=["Discovery"])


@router.get("/destinations", response_model=List[DestinationRead])
async def list_destinations(db: AsyncSession = Depends(get_db)):
    """List all supported travel destinations across India."""
    return await get_all_destinations(db)


@router.get("/destinations/{identifier}", response_model=DestinationRead)
async def get_destination(identifier: str, db: AsyncSession = Depends(get_db)):
    """Get rich destination details by name or UUID."""
    dest = await get_destination_by_name_or_id(db, identifier)
    if not dest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Destination not found.")
    return dest


@router.get("/places", response_model=List[PlaceRead])
async def list_places(
    destination_id: Optional[uuid.UUID] = None,
    category: Optional[str] = None,
    hidden_spots_only: bool = False,
    db: AsyncSession = Depends(get_db),
):
    """Discover places, heritage monuments, temples, viewpoints, and hidden spots."""
    query = select(Place).where(Place.is_deleted == False)
    if destination_id:
        query = query.where(Place.destination_id == destination_id)
    if category:
        query = query.where(Place.category == category)
    if hidden_spots_only:
        query = query.where(Place.is_hidden_spot == True)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/events", response_model=List[EventRead])
async def list_events(
    destination_id: Optional[uuid.UUID] = None,
    db: AsyncSession = Depends(get_db),
):
    """Discover festivals, cultural celebrations, and local events."""
    query = select(Event).where(Event.is_deleted == False)
    if destination_id:
        query = query.where(Event.destination_id == destination_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/activities", response_model=List[ActivityRead])
async def list_activities(
    destination_id: Optional[uuid.UUID] = None,
    difficulty: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Discover adventure sports, safaris, heritage walks, and workshops."""
    query = select(Activity).where(Activity.is_deleted == False)
    if destination_id:
        query = query.where(Activity.destination_id == destination_id)
    if difficulty:
        query = query.where(Activity.difficulty == difficulty)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/restaurants", response_model=List[RestaurantRead])
async def list_restaurants(
    destination_id: Optional[uuid.UUID] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Discover local food stalls, iconic eateries, and cafes."""
    query = select(Restaurant).where(Restaurant.is_deleted == False)
    if destination_id:
        query = query.where(Restaurant.destination_id == destination_id)
    if category:
        query = query.where(Restaurant.category == category)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/shops", response_model=List[ShopRead])
async def list_shops(
    destination_id: Optional[uuid.UUID] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """Discover famous cultural stores for traditional attire, jewelry, handicrafts, and artifacts."""
    query = select(Shop).where(Shop.is_deleted == False)
    if destination_id:
        query = query.where(Shop.destination_id == destination_id)
    if category:
        query = query.where(Shop.category == category)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/nearby", response_model=NearbySearchResponse)
async def get_nearby(
    latitude: float = Query(..., description="Traveller's current latitude"),
    longitude: float = Query(..., description="Traveller's current longitude"),
    radius_km: float = Query(10.0, ge=1.0, le=50.0),
    db: AsyncSession = Depends(get_db),
):
    """Location-aware discovery: Find places, restaurants, shops, and experiences near where you are standing."""
    return await get_nearby_entities(db, latitude, longitude, radius_km)
