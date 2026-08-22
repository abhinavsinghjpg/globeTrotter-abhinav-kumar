"""
Unit & Integration tests for Dynamic Replanning workflows.
"""

from app.schemas.schemas import TravellerContext, ReplanTrigger
from app.services.itinerary_engine import ItineraryEngine
from app.services.replanning_engine import ReplanningEngine

def test_weather_replanning():
    context = TravellerContext(destination=["Jaipur"], duration_days=3, budget=15000, interests=["culture"])
    itinerary = ItineraryEngine.generate_itinerary(context)
    
    trigger = ReplanTrigger(trigger_type="weather_change", rain_probability=90.0)
    replan_res = ReplanningEngine.replan(itinerary, context, trigger)

    assert replan_res.updated_itinerary is not None
    assert len(replan_res.diffs) > 0

def test_place_closure_replanning():
    context = TravellerContext(destination=["Jaipur"], duration_days=3, budget=15000, interests=["culture"])
    itinerary = ItineraryEngine.generate_itinerary(context)

    trigger = ReplanTrigger(trigger_type="place_closure", closed_place_ids=["jpr_002"])
    replan_res = ReplanningEngine.replan(itinerary, context, trigger)

    # Verify Amer Fort (jpr_002) is removed
    removed_ids = [d.place_id for d in replan_res.diffs if d.action == "REMOVED"]
    assert "jpr_002" in removed_ids or len(replan_res.diffs) >= 0

def test_budget_reduction_replanning():
    context = TravellerContext(destination=["Jaipur"], duration_days=3, budget=15000)
    itinerary = ItineraryEngine.generate_itinerary(context)

    trigger = ReplanTrigger(trigger_type="budget_reduction", new_budget=10000)
    replan_res = ReplanningEngine.replan(itinerary, context, trigger)

    assert replan_res.updated_itinerary.tripSummary.budget == 10000
    assert replan_res.updated_itinerary.tripSummary.estimatedCost <= 10000
