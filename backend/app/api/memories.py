"""
Trip Memories, Travel Notes & Local Video Reels API router (§21 & §22 PRD, Requirement 12 & 17).
"""

from fastapi import APIRouter, Query, Body
from pydantic import BaseModel
from typing import List, Optional
import time

router = APIRouter(prefix="/memories", tags=["Trip Memories & Reels"])

class AddNoteRequest(BaseModel):
    city: str
    note: str
    author: Optional[str] = "Traveler"

NOTES_STORAGE: List[dict] = [
    {
        "id": "note-1",
        "city": "Jaipur",
        "note": "Sunrise at Nahargarh Fort was unreal! The golden light hitting the Jal Mahal lake was breathtaking.",
        "author": "Priya S.",
        "created_at": "Today, 09:30 AM",
    },
    {
        "id": "note-2",
        "city": "Jaipur",
        "note": "Do not miss the Pyaaz Kachori at Rawat Mishtan — come before 9 AM for the freshest batch.",
        "author": "Rahul V.",
        "created_at": "Yesterday, 04:15 PM",
    },
]

@router.get("/notes")
def get_notes(city: Optional[str] = Query("Jaipur")):
    """
    Returns user notes and travel memories for a destination.
    """
    if city:
        city_lower = city.lower()
        filtered = [n for n in NOTES_STORAGE if city_lower in n["city"].lower()]
        return {"city": city, "notes": filtered or NOTES_STORAGE}
    return {"city": "All", "notes": NOTES_STORAGE}

@router.post("/notes/add")
def add_note(req: AddNoteRequest = Body(...)):
    """
    Adds a new travel note / secret tip.
    """
    new_note = {
        "id": f"note-{int(time.time()*1000)}",
        "city": req.city,
        "note": req.note,
        "author": req.author,
        "created_at": "Just now",
    }
    NOTES_STORAGE.insert(0, new_note)
    return {"status": "success", "note": new_note}

@router.get("/reels")
def get_reels(city: str = Query("Jaipur")):
    """
    Returns trending photography angles and Instagram video reels for the city.
    """
    return {
        "city": city,
        "reels": [
            {
                "title": f"Top 5 Hidden Corners of {city} Heritage Monuments",
                "creator": "@wanderlust_raj",
                "views": "240K Views",
                "image": "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=600&q=80",
            },
            {
                "title": f"Sunset Chai Point on {city} High Ramparts",
                "creator": "@city_vibes",
                "views": "180K Views",
                "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
            },
            {
                "title": f"Ultimate Street Food & Sweets Guide in {city}",
                "creator": "@foodie_explorer",
                "views": "420K Views",
                "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
            },
        ]
    }
