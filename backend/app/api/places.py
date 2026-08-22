"""
Places API router for searching places and managing operational status.
"""

from fastapi import APIRouter, Query, Body
from typing import List, Optional, Dict
from app.schemas.schemas import Place
from app.services.rag_service import rag_service
from app.services.place_status_service import PlaceStatusService

router = APIRouter(prefix="/places", tags=["Places Data Service"])

@router.get("/search", response_model=List[Place])
def search_places(
    city: Optional[str] = Query(None),
    query: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    max_cost: Optional[float] = Query(None),
    indoor_only: Optional[bool] = Query(None)
):
    """
    RAG Metadata-filtered search over verified travel dataset.
    """
    return rag_service.search_places(
        city=city,
        query=query,
        category=category,
        max_cost=max_cost,
        indoor_only=indoor_only
    )

@router.post("/status/update")
def update_place_status(payload: Dict[str, str] = Body(...)):
    """
    Simulates changing a place's status (e.g., place_id: "jpr_002", status: "temporarily_closed").
    """
    place_id = payload.get("place_id")
    status = payload.get("status", "open")
    if place_id:
        PlaceStatusService.set_status(place_id, status)
        return {"status": "success", "place_id": place_id, "new_status": status}
    return {"status": "error", "message": "Missing place_id"}
