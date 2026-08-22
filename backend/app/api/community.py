"""
Community API router for Co-Travelers, Group Matchmaking, and Cab Splitting (§20 PRD, Requirement 14).
"""

from fastapi import APIRouter, Query, Body, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import time

router = APIRouter(prefix="/community", tags=["Community & Co-Travelers"])

class TravelGroupSchema(BaseModel):
    id: str
    title: str
    city: str
    creator: str
    members_count: str
    date: str
    split_cost: str
    avatar: str
    meeting_point: Optional[str] = None
    created_at: float = Field(default_factory=time.time)

class CreateGroupRequest(BaseModel):
    title: str
    city: str
    creator_name: Optional[str] = "Traveler"
    date_time: str
    max_members: int = 4
    split_cost: str = "₹350 / person (Cab Split)"
    meeting_point: Optional[str] = "City Center"

# In-memory storage for community groups (can be backed by Postgres)
COMMUNITY_GROUPS: List[dict] = [
    {
        "id": "grp-jaipur-1",
        "title": "Amer Fort & Nahargarh Sunset Group Tour",
        "city": "Jaipur",
        "creator": "Karan M. (Delhi)",
        "members_count": "3 / 6 Travellers",
        "date": "Tomorrow (08:30 AM)",
        "split_cost": "₹450 / person (Private AC Cab Split)",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        "meeting_point": "City Palace Gate #2",
        "created_at": 1724300000.0,
    },
    {
        "id": "grp-jaipur-2",
        "title": "Old City Food & Bazaars Heritage Walk",
        "city": "Jaipur",
        "creator": "Sneha & Friends (Bangalore)",
        "members_count": "4 / 8 Foodies",
        "date": "This Saturday (04:00 PM)",
        "split_cost": "₹250 / person (Guide Fee Split)",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        "meeting_point": "Main Clock Tower Market",
        "created_at": 1724310000.0,
    },
]

@router.get("/groups")
def get_groups(city: Optional[str] = Query(None, description="City name to filter groups")):
    """
    Returns active traveler groups for a given destination.
    """
    if city:
        city_lower = city.lower()
        filtered = [g for g in COMMUNITY_GROUPS if city_lower in g["city"].lower()]
        if filtered:
            return {"city": city, "groups": filtered, "total": len(filtered)}
    return {"city": city or "All", "groups": COMMUNITY_GROUPS, "total": len(COMMUNITY_GROUPS)}

@router.post("/groups/create")
def create_group(req: CreateGroupRequest = Body(...)):
    """
    Creates and publishes a new travel group for co-travelers and cab cost splitting.
    """
    new_group = {
        "id": f"grp-{int(time.time()*1000)}",
        "title": req.title,
        "city": req.city,
        "creator": f"{req.creator_name} (You)",
        "members_count": f"1 / {req.max_members} Travellers",
        "date": req.date_time,
        "split_cost": req.split_cost,
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        "meeting_point": req.meeting_point,
        "created_at": time.time(),
    }
    COMMUNITY_GROUPS.insert(0, new_group)
    return {"status": "success", "message": "Group created successfully", "group": new_group}
