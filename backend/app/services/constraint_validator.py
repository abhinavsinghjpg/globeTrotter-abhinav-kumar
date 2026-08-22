"""
Deterministic Hard Constraint Engine for Itinerary Validation.
"""

from typing import List, Tuple, Dict, Any
from datetime import datetime, timedelta
from app.schemas.schemas import ActivitySlot, Place, TravellerContext
from app.core.config import settings

class ConstraintValidator:
    """
    Validates hard constraints deterministically without relying on LLM guesses.
    """
    
    @staticmethod
    def parse_time(time_str: str) -> datetime:
        """Parses 'HH:MM' string into a reference datetime object."""
        return datetime.strptime(time_str, "%H:%M")

    @classmethod
    def check_opening_hours(cls, slot_start: str, slot_end: str, place: Place) -> Tuple[bool, str]:
        """
        Validates if activity start and end times fall strictly within place opening hours.
        """
        try:
            start_dt = cls.parse_time(slot_start)
            end_dt = cls.parse_time(slot_end)
            opening_dt = cls.parse_time(place.opening_time)
            closing_dt = cls.parse_time(place.closing_time)
            
            if start_dt < opening_dt:
                return False, f"Activity starts at {slot_start}, but {place.name} opens at {place.opening_time}."
            if end_dt > closing_dt:
                return False, f"Activity ends at {slot_end}, but {place.name} closes at {place.closing_time}."
            return True, "Opening hours valid."
        except Exception as e:
            return False, f"Time parsing error: {str(e)}"

    @classmethod
    def check_travel_feasibility(cls, prev_slot_end: str, curr_slot_start: str, travel_minutes: int) -> Tuple[bool, str]:
        """
        Validates if travel time between consecutive activities fits in the schedule.
        """
        try:
            prev_end_dt = cls.parse_time(prev_slot_end)
            curr_start_dt = cls.parse_time(curr_slot_start)
            available_gap = int((curr_start_dt - prev_end_dt).total_seconds() / 60)
            
            if available_gap < travel_minutes:
                return False, f"Insufficient travel time ({available_gap} mins available, need {travel_minutes} mins)."
            return True, "Travel time feasible."
        except Exception as e:
            return False, f"Travel time check error: {str(e)}"

    @classmethod
    def check_place_status(cls, place: Place) -> Tuple[bool, str]:
        """
        Validates whether place operational status is open.
        """
        if place.status.lower() != "open":
            return False, f"Place '{place.name}' is currently {place.status}."
        return True, "Place is open."

    @classmethod
    def check_weather_compatibility(cls, place: Place, rain_probability: float = 0.0) -> Tuple[bool, str]:
        """
        Validates weather suitability. If place is outdoor/weather_sensitive and rain >= threshold, flag invalid.
        """
        if place.weather_sensitive and rain_probability >= settings.RAIN_THRESHOLD_PERCENT:
            return False, f"Place '{place.name}' is outdoor/weather-sensitive and rain probability is {rain_probability}%."
        return True, "Weather compatible."

    @classmethod
    def validate_daily_schedule(cls, activities: List[ActivitySlot], rain_probability: float = 0.0) -> Tuple[bool, List[str]]:
        """
        Validates schedule continuity, opening hours, travel time gaps, non-overlap, and operational statuses for a day.
        """
        errors = []
        for i, curr in enumerate(activities):
            # 1. Place operational status check
            if curr.status.lower() != "open":
                errors.append(f"Slot '{curr.name}' is invalid because status is '{curr.status}'.")

            # 2. Weather check
            if curr.weather_sensitive and rain_probability >= settings.RAIN_THRESHOLD_PERCENT:
                errors.append(f"Slot '{curr.name}' is weather-sensitive during rain ({rain_probability}%).")

            # 3. Schedule continuity & gap check
            if i > 0:
                prev = activities[i-1]
                prev_end = cls.parse_time(prev.endTime)
                curr_start = cls.parse_time(curr.startTime)
                if curr_start < prev_end:
                    errors.append(f"Overlap detected between '{prev.name}' (ends {prev.endTime}) and '{curr.name}' (starts {curr.startTime}).")
                else:
                    gap_mins = int((curr_start - prev_end).total_seconds() / 60)
                    if gap_mins < curr.travelMinutes:
                        errors.append(f"Insufficient travel time to '{curr.name}' ({gap_mins}m gap vs {curr.travelMinutes}m travel).")

        return len(errors) == 0, errors

    @classmethod
    def validate_trip_budget(cls, total_cost: float, budget: float) -> Tuple[bool, str]:
        """
        Validates total cost against user budget.
        """
        if total_cost > budget:
            return False, f"Total cost (₹{total_cost:,.2f}) exceeds total budget (₹{budget:,.2f})."
        return True, f"Budget compliant (₹{total_cost:,.2f} / ₹{budget:,.2f})."
    
    @classmethod
    def is_activity_valid(cls, place: Place, slot_start: str, slot_end: str, prev_end_time: str, travel_mins: int, rain_prob: float = 0.0) -> Tuple[bool, str]:
        """
        Combined candidate validation check before placing into schedule.
        """
        status_ok, status_msg = cls.check_place_status(place)
        if not status_ok: return False, status_msg

        weather_ok, weather_msg = cls.check_weather_compatibility(place, rain_prob)
        if not weather_ok: return False, weather_msg

        opening_ok, opening_msg = cls.check_opening_hours(slot_start, slot_end, place)
        if not opening_ok: return False, opening_msg

        if prev_end_time:
            travel_ok, travel_msg = cls.check_travel_feasibility(prev_end_time, slot_start, travel_mins)
            if not travel_ok: return False, travel_msg

        return True, "Valid activity placement."
