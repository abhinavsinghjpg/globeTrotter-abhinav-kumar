import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.dependencies import get_current_active_admin
from app.user_auth.models import User
from app.user_auth.schemas import UserRead
from app.discovery.models import Place
from app.discovery.schemas import PlaceRead
from app.admin.schemas import (
    AdminOverviewStats,
    PlaceStatusUpdate,
    UserSuspendRequest,
    UserRoleUpdate,
)
from app.admin.service import (
    get_admin_overview_stats,
    update_place_operational_status,
    set_user_suspension,
    change_user_role,
)

router = APIRouter(prefix="/admin", tags=["Admin Panel"])


@router.get("/stats", response_model=AdminOverviewStats)
async def admin_overview(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    """Admin Dashboard summary metrics."""
    return await get_admin_overview_stats(db)


@router.get("/users", response_model=List[UserRead])
async def list_all_users(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    """List all registered users with their roles, profiles, and active status."""
    result = await db.execute(
        select(User).options(selectinload(User.profile)).where(User.is_deleted == False)
    )
    return result.scalars().all()


@router.patch("/users/{user_id}/suspend", response_model=UserRead)
async def suspend_or_activate_user(
    user_id: uuid.UUID,
    data: UserSuspendRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    """Suspend or reactivate a user account."""
    return await set_user_suspension(db, user_id, data)


@router.patch("/users/{user_id}/role", response_model=UserRead)
async def update_user_role(
    user_id: uuid.UUID,
    data: UserRoleUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    """Change a user's role (traveller, contributor, guide, moderator, admin)."""
    return await change_user_role(db, user_id, data)


@router.get("/places", response_model=List[PlaceRead])
async def list_admin_places(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    """List all places with verification confidence and status."""
    result = await db.execute(select(Place).where(Place.is_deleted == False))
    return result.scalars().all()


@router.patch("/places/{place_id}/status", response_model=PlaceRead)
async def update_place_status(
    place_id: uuid.UUID,
    data: PlaceStatusUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    """Update place status (Open, Temporarily Closed, Under Maintenance) with reason."""
    return await update_place_operational_status(db, place_id, data)
