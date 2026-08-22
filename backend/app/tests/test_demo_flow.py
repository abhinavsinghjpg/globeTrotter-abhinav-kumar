"""
End-to-End Critical Demo Flow Test validating PRD Section 24.
"""

from app.schemas.schemas import TravellerContext, ReplanTrigger
from app.services.ai_orchestrator import AIOrchestrator
from app.services.itinerary_engine import ItineraryEngine
from app.services.replanning_engine import ReplanningEngine

def test_critical_demo_workflow():
    print("\n--- CRITICAL DEMO WORKFLOW START ---")

    # STEP 1: User prompt
    user_prompt = "I have 3 days in Jaipur. Budget ₹15,000. I like culture and food."
    context = AIOrchestrator.extract_traveller_context(user_prompt)
    
    assert context.duration_days == 3
    assert "Jaipur" in context.destination
    assert context.budget == 15000
    assert "culture" in context.interests

    # Generate initial itinerary
    itinerary_v1 = ItineraryEngine.generate_itinerary(context)
    print(f"STEP 1 & 2 SUCCESS: Generated v1 itinerary with score {itinerary_v1.tripSummary.overallScore}, cost: ₹{itinerary_v1.tripSummary.estimatedCost:,.0f}")

    # STEP 3: Trigger Weather change (Heavy Rain)
    weather_trig = ReplanTrigger(trigger_type="weather_change", rain_probability=90.0)
    replan_v2 = ReplanningEngine.replan(itinerary_v1, context, weather_trig)
    itinerary_v2 = replan_v2.updated_itinerary
    print(f"STEP 3 SUCCESS: Weather replanned. Summary: {replan_v2.summary_change}")

    # STEP 4: Trigger Place Closure (Amer Fort)
    closure_trig = ReplanTrigger(trigger_type="place_closure", closed_place_ids=["jpr_002"])
    replan_v3 = ReplanningEngine.replan(itinerary_v2, context, closure_trig)
    itinerary_v3 = replan_v3.updated_itinerary
    print(f"STEP 4 SUCCESS: Place closure replanned. Diffs: {len(replan_v3.diffs)}")

    # STEP 5: Trigger Budget reduction (₹10,000)
    budget_trig = ReplanTrigger(trigger_type="budget_reduction", new_budget=10000)
    context_v5 = context.model_copy()
    context_v5.budget = 10000
    replan_v4 = ReplanningEngine.replan(itinerary_v3, context_v5, budget_trig)
    itinerary_v4 = replan_v4.updated_itinerary

    # STEP 6: Assert BEFORE vs AFTER validation
    assert itinerary_v4.tripSummary.budget == 10000
    assert itinerary_v4.tripSummary.estimatedCost <= 10000
    assert itinerary_v4.tripSummary.remainingBudget >= 0
    print(f"STEP 5 & 6 SUCCESS: Final budget cut itinerary cost ₹{itinerary_v4.tripSummary.estimatedCost:,.0f} / ₹10,000. Diffs: {len(replan_v4.diffs)}")
    print("--- CRITICAL DEMO WORKFLOW PASSED ---")

if __name__ == "__main__":
    test_critical_demo_workflow()
