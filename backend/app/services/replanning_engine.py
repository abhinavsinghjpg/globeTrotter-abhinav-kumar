"""
Dynamic Replanning Engine for Real-Time Adaptations (Weather, Place Closure, Budget Drops, Preference Changes).
"""

from typing import List, Dict, Any, Tuple
from app.schemas.schemas import (
    Itinerary, TravellerContext, ReplanTrigger, ReplanResponse, ActivityDiff, ActivitySlot, DaySchedule
)
from app.services.itinerary_engine import ItineraryEngine
from app.services.rag_service import rag_service
from app.services.constraint_validator import ConstraintValidator
from app.services.scoring_engine import ScoringEngine
from app.services.place_status_service import PlaceStatusService
from app.services.weather_service import WeatherService
from app.services.ai_orchestrator import AIOrchestrator
from app.core.config import settings

class ReplanningEngine:
    """
    Executes dynamic replanning workflows and returns Before vs After diffs with crisp explanations.
    """

    @classmethod
    def replan(
        cls,
        current_itinerary: Itinerary,
        context: TravellerContext,
        trigger: ReplanTrigger
    ) -> ReplanResponse:
        """
        Main entry point for dynamic replanning execution.
        """
        updated_context = context.model_copy()
        rain_prob = 0.0
        diffs: List[ActivityDiff] = []
        removed_place_names: List[str] = []
        added_place_names: List[str] = []
        primary_reason = ""

        # 1. Weather Change Trigger
        if trigger.trigger_type == "weather_change" or trigger.weather_condition == "heavy_rain":
            rain_prob = trigger.rain_probability if trigger.rain_probability is not None else 85.0
            WeatherService.set_weather(context.destination[0], "Heavy Rain", rain_prob)
            primary_reason = f"Heavy rain ({rain_prob:.0f}% chance) detected"

        # 2. Place Closure Trigger
        elif trigger.trigger_type == "place_closure" or trigger.closed_place_ids:
            for pid in trigger.closed_place_ids:
                PlaceStatusService.set_status(pid, "temporarily_closed")
            primary_reason = "Attraction temporarily closed"

        # 3. Budget Reduction Trigger
        elif trigger.trigger_type == "budget_reduction" or trigger.new_budget is not None:
            if trigger.new_budget is not None:
                updated_context.budget = trigger.new_budget
            primary_reason = f"Budget reduced to ₹{updated_context.budget:,.0f}"

        # 4. Preference Change Trigger
        elif trigger.trigger_type == "preference_change":
            if trigger.removed_categories:
                updated_context.negative_preferences.extend(trigger.removed_categories)
            if trigger.new_interests:
                updated_context.interests.extend(trigger.new_interests)
            primary_reason = f"Preference updated (Avoid: {', '.join(updated_context.negative_preferences)})"

        # Track existing activity place IDs
        existing_place_ids = set()
        for day in current_itinerary.days:
            for act in day.activities:
                existing_place_ids.add(act.place_id)

        # Generate updated itinerary through deterministic pipeline
        new_itinerary = ItineraryEngine.generate_itinerary(
            context=updated_context,
            rain_probability=rain_prob,
            option_type=current_itinerary.option_type
        )

        new_place_ids = set()
        for day in new_itinerary.days:
            for act in day.activities:
                new_place_ids.add(act.place_id)

        # Detect Removed Places
        for day in current_itinerary.days:
            for act in day.activities:
                if act.place_id not in new_place_ids:
                    removed_place_names.append(act.name)
                    diffs.append(ActivityDiff(
                        action="REMOVED",
                        place_id=act.place_id,
                        name=act.name,
                        reason=f"{primary_reason} - violates hard operational or weather constraints."
                    ))

        # Detect Added Places
        for day in new_itinerary.days:
            for act in day.activities:
                if act.place_id not in existing_place_ids:
                    added_place_names.append(act.name)
                    diffs.append(ActivityDiff(
                        action="ADDED",
                        place_id=act.place_id,
                        name=act.name,
                        reason=f"Selected replacement with strong preference match, within budget, and verified open."
                    ))

        summary_change = f"Re-optimized itinerary for {primary_reason}. Removed {len(removed_place_names)} activities and added {len(added_place_names)} replacements."

        explanation = AIOrchestrator.generate_replan_explanation(
            trigger_type=trigger.trigger_type,
            removed_items=removed_place_names if removed_place_names else ["None"],
            added_items=added_place_names if added_place_names else ["None"],
            reason=primary_reason
        )

        return ReplanResponse(
            original_itinerary_id=current_itinerary.id,
            updated_itinerary=new_itinerary,
            diffs=diffs,
            summary_change=summary_change,
            explanation=explanation
        )
