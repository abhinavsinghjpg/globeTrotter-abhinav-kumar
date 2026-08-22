import math
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.discovery.models import Destination, Place, Event, Activity, Restaurant, Shop
from app.shared.models import PlaceStatus


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points in km."""
    R = 6371.0  # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


async def get_all_destinations(db: AsyncSession) -> List[Destination]:
    result = await db.execute(select(Destination).where(Destination.is_active == True, Destination.is_deleted == False))
    return result.scalars().all()


async def get_destination_by_name_or_id(db: AsyncSession, identifier: str) -> Optional[Destination]:
    # Check by name first (case-insensitive)
    result = await db.execute(
        select(Destination)
        .options(
            selectinload(Destination.places),
            selectinload(Destination.events),
            selectinload(Destination.activities),
            selectinload(Destination.restaurants),
            selectinload(Destination.shops),
        )
        .where(
            (Destination.name.ilike(f"%{identifier}%")),
            Destination.is_deleted == False,
        )
    )
    return result.scalar_one_or_none()


async def get_places_by_destination(
    db: AsyncSession,
    destination_id,
    category: Optional[str] = None,
    hidden_only: bool = False,
) -> List[Place]:
    query = select(Place).where(Place.destination_id == destination_id, Place.is_deleted == False)
    if category:
        query = query.where(Place.category == category)
    if hidden_only:
        query = query.where(Place.is_hidden_spot == True)
    result = await db.execute(query)
    return result.scalars().all()


async def get_nearby_entities(
    db: AsyncSession,
    latitude: float,
    longitude: float,
    radius_km: float = 15.0,
) -> dict:
    """Find places, restaurants, and shops within radius_km using spatial filtering."""
    places_res = await db.execute(select(Place).where(Place.is_deleted == False))
    all_places = places_res.scalars().all()

    rests_res = await db.execute(select(Restaurant).where(Restaurant.is_deleted == False))
    all_rests = rests_res.scalars().all()

    shops_res = await db.execute(select(Shop).where(Shop.is_deleted == False))
    all_shops = shops_res.scalars().all()

    nearby_places = [p for p in all_places if haversine_distance_km(latitude, longitude, p.latitude, p.longitude) <= radius_km]
    nearby_rests = [r for r in all_rests if haversine_distance_km(latitude, longitude, r.latitude, r.longitude) <= radius_km]
    nearby_shops = [s for s in all_shops if haversine_distance_km(latitude, longitude, s.latitude, s.longitude) <= radius_km]

    # Sort each list by proximity
    nearby_places.sort(key=lambda p: haversine_distance_km(latitude, longitude, p.latitude, p.longitude))
    nearby_rests.sort(key=lambda r: haversine_distance_km(latitude, longitude, r.latitude, r.longitude))
    nearby_shops.sort(key=lambda s: haversine_distance_km(latitude, longitude, s.latitude, s.longitude))

    return {
        "current_location": {"latitude": latitude, "longitude": longitude},
        "nearby_places": nearby_places[:10],
        "nearby_restaurants": nearby_rests[:10],
        "nearby_shops": nearby_shops[:10],
        "nearby_events": [],
    }
