from datetime import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from fastapi import HTTPException, status
from app.user_auth.models import User
from app.discovery.models import Destination, Place, Event, Restaurant
from app.shared.models import PlaceStatus, VerificationStatus
from app.admin.schemas import AdminOverviewStats, PlaceStatusUpdate, UserSuspendRequest, UserRoleUpdate


async def get_admin_overview_stats(db: AsyncSession) -> AdminOverviewStats:
    users_count = await db.scalar(select(func.count(User.id)).where(User.is_deleted == False))
    dest_count = await db.scalar(select(func.count(Destination.id)).where(Destination.is_deleted == False))
    places_count = await db.scalar(select(func.count(Place.id)).where(Place.is_deleted == False))
    events_count = await db.scalar(select(func.count(Event.id)).where(Event.is_deleted == False))
    rests_count = await db.scalar(select(func.count(Restaurant.id)).where(Restaurant.is_deleted == False))

    open_places = await db.scalar(
        select(func.count(Place.id)).where(Place.status == PlaceStatus.OPEN, Place.is_deleted == False)
    )
    temp_closed = await db.scalar(
        select(func.count(Place.id)).where(
            Place.status.in_([PlaceStatus.TEMPORARILY_CLOSED, PlaceStatus.CLOSED, PlaceStatus.UNDER_MAINTENANCE]),
            Place.is_deleted == False,
        )
    )

    return AdminOverviewStats(
        total_users=users_count or 0,
        total_destinations=dest_count or 0,
        total_places=places_count or 0,
        total_events=events_count or 0,
        total_restaurants=rests_count or 0,
        open_places_count=open_places or 0,
        temporarily_closed_count=temp_closed or 0,
        pending_verifications_count=0,
    )


async def update_place_operational_status(
    db: AsyncSession,
    place_id,
    data: PlaceStatusUpdate,
) -> Place:
    result = await db.execute(select(Place).where(Place.id == place_id))
    place = result.scalar_one_or_none()
    if not place:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Place not found.")

    place.status = data.status
    place.status_reason = data.status_reason
    place.last_verified_at = datetime.utcnow()
    if data.verification_confidence is not None:
        place.verification_confidence = data.verification_confidence

    await db.commit()
    await db.refresh(place)
    return place


async def set_user_suspension(
    db: AsyncSession,
    user_id,
    data: UserSuspendRequest,
) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.is_active = data.is_active
    await db.commit()
    await db.refresh(user)
    return user


async def change_user_role(
    db: AsyncSession,
    user_id,
    data: UserRoleUpdate,
) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.role = data.role
    await db.commit()
    await db.refresh(user)
    return user
