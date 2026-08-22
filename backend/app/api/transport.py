"""
Transportation & Vehicle Rentals API router (§13 & §14 PRD, Requirement 4 & 5).
"""

from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/transport", tags=["Transportation & Rentals"])

@router.get("/rates")
def get_transport_rates(city: str = Query("Jaipur", description="City to get transportation rates for")):
    """
    Returns estimated rates for Cabs, Bike Taxis, Self-Drive Cars, and Local E-Rickshaws.
    """
    return {
        "city": city,
        "cabs": [
            {
                "name": "Uber India",
                "types": ["UberGo", "UberAuto", "Uber Premier"],
                "rate_per_km": "₹14 - ₹20 / km",
                "deep_link": "https://m.uber.com/ul/?action=setPickup",
            },
            {
                "name": "Ola Cabs",
                "types": ["Ola Micro", "Ola Prime", "Ola Auto"],
                "rate_per_km": "₹13 - ₹18 / km",
                "deep_link": "https://www.olacabs.com/",
            },
            {
                "name": "Rapido Bike Taxi",
                "types": ["Rapido Bike"],
                "rate_per_km": "₹8 - ₹10 / km",
                "deep_link": "https://www.rapido.bike/",
            },
        ],
        "rentals": [
            {
                "provider": "Royal Brothers",
                "category": "Scooty & Bike Rentals",
                "rates": "Activa (₹450/day) · Royal Enfield 350 (₹1,100/day)",
                "link": "https://www.royalbrothers.com/",
            },
            {
                "provider": "Zoomcar",
                "category": "Self-Drive Cars",
                "rates": "Hatchback (₹1,800/day) · SUV / Thar (₹3,800/day)",
                "link": "https://www.zoomcar.com/",
            },
        ],
        "local_transit": {
            "e_rickshaw_short_hop": "₹20 - ₹30 / person",
            "e_rickshaw_half_day": "₹400 - ₹500",
            "metro_available": True if city.lower() in ["jaipur", "delhi", "lucknow", "bengaluru", "mumbai", "hyderabad", "kolkata"] else False,
        }
    }
