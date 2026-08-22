"""
Replan API router for dynamic real-time itinerary modifications.
"""

from fastapi import APIRouter, Body
from typing import Dict, Any
from app.schemas.schemas import Itinerary, TravellerContext, ReplanTrigger, ReplanResponse
from app.services.replanning_engine import ReplanningEngine

router = APIRouter(prefix="/replan", tags=["Dynamic Replanner"])

@router.post("/execute", response_model=ReplanResponse)
def execute_replan(payload: Dict[str, Any] = Body(...)):
    """
    Triggers real-time itinerary re-optimization for Weather, Place Closure, Budget Reductions, or Preference changes.
    """
    itinerary_raw = payload.get("current_itinerary")
    context_raw = payload.get("context")
    trigger_raw = payload.get("trigger")

    current_itinerary = Itinerary(**itinerary_raw)
    context = TravellerContext(**context_raw)
    trigger = ReplanTrigger(**trigger_raw)

    return ReplanningEngine.replan(current_itinerary, context, trigger)
