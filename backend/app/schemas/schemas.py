"""
Pydantic schemas for the Adaptive AI Travel Decision Engine.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class TravellerContext(BaseModel):
    destination: List[str] = Field(default_factory=lambda: ["Jaipur"])
    duration_days: int = Field(default=3, ge=1, le=14)
    travellers: int = Field(default=2, ge=1)
    budget: float = Field(default=15000.0, ge=0.0)
    interests: List[str] = Field(default_factory=lambda: ["culture", "food"])
    activity_level: str = Field(default="moderate")  # low, moderate, high
    walking_level: str = Field(default="moderate")   # low, moderate, high
    group_type: str = Field(default="couple")        # solo, couple, family, friends
    food_preference: Optional[str] = "local"
    negative_preferences: List[str] = Field(default_factory=list) # e.g. ["forts"]


class IntentResult(BaseModel):
    intent: str
    entities: Dict[str, Any] = Field(default_factory=dict)
    requires_tools: bool = True
    confidence: float = 0.95


class Place(BaseModel):
    id: str
    name: str
    city: str
    category: str
    description: str
    cost: float = 0.0
    duration_minutes: int = 120
    opening_time: str = "09:00"
    closing_time: str = "18:00"
    latitude: float
    longitude: float
    tags: List[str] = Field(default_factory=list)
    weather_sensitive: bool = False
    indoor: bool = True
    status: str = "open"  # open, temporarily_closed, permanently_closed
    rating: float = 4.5
    verification_status: str = "verified"
    source: str = "curated_database"
    last_verified_at: str = "2026-08-01"
    confidence_score: float = 0.95


class ActivitySlot(BaseModel):
    place_id: str
    name: str
    category: str
    description: str
    startTime: str
    endTime: str
    cost: float
    durationMinutes: int
    travelMinutes: int
    travelDistanceKm: float = 0.0
    score: float
    reason: str
    indoor: bool = True
    weather_sensitive: bool = False
    status: str = "open"
    latitude: float = 0.0
    longitude: float = 0.0


class DaySchedule(BaseModel):
    day: int
    date: str
    city: str
    activities: List[ActivitySlot] = Field(default_factory=list)
    dayCost: float = 0.0
    dayTravelMinutes: int = 0


class TripSummary(BaseModel):
    days: int
    budget: float
    estimatedCost: float
    remainingBudget: float
    preferenceScore: float
    feasibilityScore: float
    overallScore: float
    travelEfficiencyScore: float = 85.0
    weatherSuitabilityScore: float = 90.0


class Itinerary(BaseModel):
    id: str
    tripSummary: TripSummary
    days: List[DaySchedule]
    explanation: Dict[str, Any] = Field(default_factory=dict)
    option_type: str = "BEST_OVERALL"  # BEST_OVERALL, LOWEST_COST, MOST_RELAXED


class ItineraryOptions(BaseModel):
    option_a: Itinerary  # BEST OVERALL
    option_b: Itinerary  # LOWEST COST
    option_c: Itinerary  # MOST RELAXED


class ReplanTrigger(BaseModel):
    trigger_type: str  # weather_change, place_closure, budget_reduction, preference_change, time_reduction
    weather_condition: Optional[str] = None  # e.g., "heavy_rain"
    rain_probability: Optional[float] = None
    closed_place_ids: List[str] = Field(default_factory=list)
    new_budget: Optional[float] = None
    removed_categories: List[str] = Field(default_factory=list)
    new_interests: List[str] = Field(default_factory=list)
    available_hours: Optional[float] = None


class ActivityDiff(BaseModel):
    action: str  # REMOVED, ADDED, MODIFIED
    place_id: str
    name: str
    reason: str
    details: Optional[Dict[str, Any]] = None


class ReplanResponse(BaseModel):
    original_itinerary_id: str
    updated_itinerary: Itinerary
    diffs: List[ActivityDiff]
    summary_change: str
    explanation: Dict[str, Any]


class ScenarioResult(BaseModel):
    scenario_id: str
    name: str
    category: str
    passed: bool
    budget_compliant: bool
    time_feasible: bool
    opening_hours_valid: bool
    no_conflict: bool
    preference_matched: bool
    replanned_successfully: Optional[bool] = None
    details: str


class EvaluationReport(BaseModel):
    total_scenarios: int
    passed_scenarios: int
    intent_accuracy: float
    context_accuracy: float
    budget_compliance: float
    time_feasibility: float
    preference_match: float
    opening_hours_validity: float
    no_conflict_rate: float
    recommendation_relevance: float
    replanning_success: float
    hallucination_rate: float
    results: List[ScenarioResult]
