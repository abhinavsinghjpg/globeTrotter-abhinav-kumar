"""
Itinerary API router for itinerary generation, multi-option retrieval, and validation.
"""

from fastapi import APIRouter, Body
from app.schemas.schemas import TravellerContext, Itinerary, ItineraryOptions
from app.services.itinerary_engine import ItineraryEngine

router = APIRouter(prefix="/itinerary", tags=["Itinerary Engine"])

@router.post("/generate", response_model=Itinerary)
def generate_itinerary(context: TravellerContext = Body(...)):
    """
    Generates a single optimized itinerary for a TravellerContext.
    """
    return ItineraryEngine.generate_itinerary(context)

@router.post("/options", response_model=ItineraryOptions)
def generate_options(context: TravellerContext = Body(...)):
    """
    Generates three itinerary choices: Option A (Best Overall), Option B (Lowest Cost), Option C (Most Relaxed).
    """
    return ItineraryEngine.generate_options(context)
