"""
Route Service for Haversine Distance and Travel Time calculations.
"""

import math
from typing import Tuple
from app.core.config import settings

class RouteService:
    @staticmethod
    def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculates Great Circle distance between two geo coordinates in kilometers.
        """
        if lat1 == lat2 and lon1 == lon2:
            return 0.0
            
        R = 6371.0  # Earth radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    @classmethod
    def estimate_travel_time_minutes(cls, lat1: float, lon1: float, lat2: float, lon2: float) -> int:
        """
        Estimates urban travel time in minutes based on distance and average city traffic speed.
        """
        distance_km = cls.haversine_distance_km(lat1, lon1, lat2, lon2)
        if distance_km == 0:
            return 0
        
        # Add 1.3 multiplier for actual road geometry vs straight line
        road_distance_km = distance_km * 1.3
        travel_hours = road_distance_km / settings.DEFAULT_TRAVEL_SPEED_KMH
        minutes = int(math.ceil(travel_hours * 60)) + settings.AVERAGE_BUFFER_MINUTES
        return max(10, min(120, minutes))
