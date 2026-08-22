"""
Configurable 7-Factor Weighted Scoring Engine.
"""

from typing import Dict, Any, List
from app.schemas.schemas import Place, TravellerContext
from app.core.config import settings

class ScoringEngine:
    """
    Computes normalized 0-100 weighted scores for activities and itineraries.
    """

    @classmethod
    def calculate_preference_match(cls, place: Place, context: TravellerContext) -> float:
        """
        Sub-score 1: Preference Match (0-100).
        Evaluates category match, tag match, group type alignment, and negative preference penalties.
        """
        score = 50.0  # baseline
        
        # Check negative preferences first
        for neg in context.negative_preferences:
            if neg.lower() in place.category.lower() or any(neg.lower() in tag.lower() for tag in place.tags):
                return 0.0  # Zero score if explicitly blacklisted!

        # Positive category match
        user_interests = [i.lower() for i in context.interests]
        place_tags = [t.lower() for t in place.tags] + [place.category.lower()]

        matched_count = sum(1 for interest in user_interests if any(interest in tag for tag in place.tags) or interest in place.category.lower())
        if matched_count > 0:
            score += min(40.0, matched_count * 20.0)

        # Rating boost
        score += (place.rating - 4.0) * 10.0

        # Group type preference adjustment
        if context.group_type.lower() in ["family", "couple"] and place.category.lower() in ["culture", "palace", "museum", "nature"]:
            score += 10.0
        elif context.group_type.lower() == "solo" and place.category.lower() in ["adventure", "food", "walking"]:
            score += 10.0

        return max(0.0, min(100.0, score))

    @classmethod
    def calculate_budget_efficiency(cls, place_cost: float, remaining_budget: float, per_activity_target: float) -> float:
        """
        Sub-score 2: Budget Efficiency (0-100).
        Rewards activities that deliver high value without burning excess budget.
        """
        if place_cost == 0.0:
            return 100.0  # Free activities give max budget efficiency!
        
        if place_cost > remaining_budget:
            return 0.0

        ratio = place_cost / max(1.0, per_activity_target)
        if ratio <= 1.0:
            return 90.0 + (1.0 - ratio) * 10.0
        else:
            return max(10.0, 100.0 - (ratio - 1.0) * 40.0)

    @classmethod
    def calculate_time_efficiency(cls, duration_minutes: int) -> float:
        """
        Sub-score 3: Time Efficiency (0-100).
        Ideal activity length is 60-150 minutes.
        """
        if 60 <= duration_minutes <= 150:
            return 100.0
        elif duration_minutes < 60:
            return 80.0
        else:
            return max(40.0, 100.0 - (duration_minutes - 150) * 0.4)

    @classmethod
    def calculate_route_efficiency(cls, travel_minutes: int) -> float:
        """
        Sub-score 4: Route Efficiency (0-100).
        Shorter travel time yields higher score.
        """
        if travel_minutes <= 15:
            return 100.0
        elif travel_minutes <= 30:
            return 85.0
        elif travel_minutes <= 45:
            return 65.0
        else:
            return max(20.0, 100.0 - travel_minutes * 1.5)

    @classmethod
    def calculate_weather_suitability(cls, place: Place, rain_probability: float = 0.0) -> float:
        """
        Sub-score 5: Weather Suitability (0-100).
        Indoor activities get 100 during rain, outdoor places drop based on rain risk.
        """
        if place.indoor or not place.weather_sensitive:
            return 100.0
        else:
            return max(0.0, 100.0 - rain_probability)

    @classmethod
    def calculate_event_relevance(cls, place: Place, has_active_event: bool = False) -> float:
        """
        Sub-score 6: Event Relevance (0-100).
        """
        return 100.0 if has_active_event else 50.0

    @classmethod
    def calculate_freshness(cls, place: Place) -> float:
        """
        Sub-score 7: Freshness / Confidence Score (0-100).
        """
        return max(0.0, min(100.0, place.confidence_score * 100.0))

    @classmethod
    def score_place(cls, place: Place, context: TravellerContext, travel_minutes: int = 15, remaining_budget: float = 5000.0, rain_probability: float = 0.0) -> float:
        """
        Calculates final weighted score for a candidate place.
        """
        pref_score = cls.calculate_preference_match(place, context)
        if pref_score == 0.0:  # Negated or blacklisted
            return 0.0

        per_act_target = context.budget / (context.duration_days * 3)
        budget_score = cls.calculate_budget_efficiency(place.cost, remaining_budget, per_act_target)
        time_score = cls.calculate_time_efficiency(place.duration_minutes)
        route_score = cls.calculate_route_efficiency(travel_minutes)
        weather_score = cls.calculate_weather_suitability(place, rain_probability)
        event_score = cls.calculate_event_relevance(place, False)
        freshness_score = cls.calculate_freshness(place)

        final_score = (
            pref_score * settings.WEIGHT_PREFERENCE_MATCH +
            budget_score * settings.WEIGHT_BUDGET_EFFICIENCY +
            time_score * settings.WEIGHT_TIME_EFFICIENCY +
            route_score * settings.WEIGHT_ROUTE_EFFICIENCY +
            weather_score * settings.WEIGHT_WEATHER_SUITABILITY +
            event_score * settings.WEIGHT_EVENT_RELEVANCE +
            freshness_score * settings.WEIGHT_FRESHNESS
        )

        return round(max(0.0, min(100.0, final_score)), 1)
