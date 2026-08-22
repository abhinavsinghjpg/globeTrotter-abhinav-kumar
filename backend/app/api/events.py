"""
Upcoming Festivals, Major Events & Safaris API router (§10 PRD, Requirement 1 & 15).
"""

from fastapi import APIRouter, Query
from typing import List

router = APIRouter(prefix="/events", tags=["Festivals & Events"])

EVENTS_DATABASE = {
    "jaipur": [
        {
            "name": "Jaipur Literature Festival (JLF 2026)",
            "dates": "January 22 – 26, 2026",
            "venue": "Hotel Clarks Amer, JLN Marg, Jaipur",
            "description": "The world's greatest celebration of literature and ideas, hosting international Nobel laureates, novelists, poets, and thinkers across 5 vibrant days.",
            "tag": "Global Literary Festival",
            "ticket_type": "Free Delegate Registration",
            "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
        },
        {
            "name": "Royal Teej Festival & Palace Processions",
            "dates": "Monsoon Season (August)",
            "venue": "City Palace to Tripolia Gate, Pink City",
            "description": "Centuries-old royal procession featuring Goddess Teej palanquin, decorated elephants, Kalbelia dancers, and traditional Ghevar feasts.",
            "tag": "Royal Cultural Procession",
            "ticket_type": "Free Public Viewing",
            "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
        },
        {
            "name": "SkyWaltz Sunrise Hot Air Balloon Safari",
            "dates": "Daily Morning Flights (October – March)",
            "venue": "Amer Fort & Kukas Ridge Launch Pad",
            "description": "Float 2,000 feet above the rugged Aravalli ridges and hilltop forts as golden morning light illuminates the desert landscape.",
            "tag": "Adventure & Aerial Safari",
            "ticket_type": "₹12,500 / person",
            "image": "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80",
        },
    ],
    "mathura": [
        {
            "name": "Braj Lathmar Holi & Rangotsav",
            "dates": "Spring Season (March)",
            "venue": "Barsana & Nandgaon Temples, Mathura",
            "description": "World-famous vibrant celebration of colors and traditional music across the Braj region.",
            "tag": "Traditional Grand Festival",
            "ticket_type": "Free Public Access",
            "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
        },
        {
            "name": "Janmashtami Celebrations",
            "dates": "Bhadrapada Month (August/September)",
            "venue": "Shri Krishna Janmabhoomi Temple Complex",
            "description": "Grand midnight aarti, devotional singing, and palace illuminations.",
            "tag": "Spiritual Celebration",
            "ticket_type": "Free Public Entry",
            "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
        },
    ],
}

@router.get("")
@router.get("/")
def get_events(city: str = Query("Jaipur")):
    """
    Returns upcoming festivals and major events for a destination.
    """
    city_lower = city.lower().strip()
    for key in EVENTS_DATABASE:
        if key in city_lower:
            return {"city": city, "events": EVENTS_DATABASE[key]}
    
    # Generic seasonal events fallback
    return {
        "city": city,
        "events": [
            {
                "name": f"{city} Cultural Heritage & Food Mahotsav",
                "dates": "October to March (Peak Season)",
                "venue": f"Central Ground & Historic District, {city}",
                "description": f"Annual cultural and traditional music fair showcasing local crafts, folk dance, and culinary heritage of {city}.",
                "tag": "Regional Cultural Fair",
                "ticket_type": "Free Entry",
                "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
            }
        ]
    }
