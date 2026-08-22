"""
Configuration settings for the Adaptive AI Travel Decision Engine.
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Adaptive AI Travel Decision Engine"
    API_V1_STR: str = "/api"
    
    # Gemini API Key (if provided in environment)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Scoring Weights (Must sum to 1.0)
    WEIGHT_PREFERENCE_MATCH: float = 0.30
    WEIGHT_BUDGET_EFFICIENCY: float = 0.20
    WEIGHT_TIME_EFFICIENCY: float = 0.15
    WEIGHT_ROUTE_EFFICIENCY: float = 0.15
    WEIGHT_WEATHER_SUITABILITY: float = 0.10
    WEIGHT_EVENT_RELEVANCE: float = 0.05
    WEIGHT_FRESHNESS: float = 0.05
    
    # Weather replanning threshold
    RAIN_THRESHOLD_PERCENT: float = 60.0
    
    # Default schedule configuration
    DEFAULT_DAY_START_TIME: str = "09:00"
    DEFAULT_DAY_END_TIME: str = "20:00"
    DEFAULT_TRAVEL_SPEED_KMH: float = 25.0  # City traffic speed estimate
    AVERAGE_BUFFER_MINUTES: int = 15

    class Config:
        case_sensitive = True

settings = Settings()
