"""
Standalone Interactive CLI for the Adaptive AI Travel Decision Engine.
Allows running intent detection, context extraction, itinerary generation, dynamic replanning, and quantitative evaluation directly from terminal.
"""

import sys
import json
import argparse
from app.schemas.schemas import TravellerContext, ReplanTrigger
from app.services.ai_orchestrator import AIOrchestrator
from app.services.itinerary_engine import ItineraryEngine
from app.services.replanning_engine import ReplanningEngine
from app.evaluation.evaluator import evaluator

def print_header(title: str):
    print("\n" + "=" * 60)
    print(f" {title}")
    print("=" * 60)

def main():
    parser = argparse.ArgumentParser(description="Adaptive AI Travel Decision Engine CLI")
    parser.add_argument("--prompt", type=str, help="Natural language trip request prompt")
    parser.add_argument("--eval", action="store_true", help="Run full 30-scenario quantitative evaluation suite")
    parser.add_argument("--interactive", action="store_true", help="Start interactive CLI session")
    args = parser.parse_args()

    if args.eval:
        print_header("RUNNING QUANTITATIVE AI EVALUATION BENCHMARK")
        report = evaluator.run_all()
        print(f"Total Scenarios: {report.total_scenarios}")
        print(f"Passed Scenarios: {report.passed_scenarios} ({report.passed_scenarios/report.total_scenarios*100:.1f}%)")
        print(f"Intent Accuracy: {report.intent_accuracy}%")
        print(f"Budget Compliance: {report.budget_compliance}%")
        print(f"Time Feasibility: {report.time_feasibility}%")
        print(f"Opening Hours Validity: {report.opening_hours_validity}%")
        print(f"No Conflict Rate: {report.no_conflict_rate}%")
        print(f"Hallucination Rate: {report.hallucination_rate}%")
        return

    prompt = args.prompt or "I am travelling to Jaipur for 3 days with my family. My budget is ₹15,000. We like culture and food."
    
    print_header("1. INTENT DETECTION & CONTEXT EXTRACTION")
    intent = AIOrchestrator.detect_intent(prompt)
    print(f"Prompt: {prompt}")
    print(f"Detected Intent: {intent.intent}")
    
    context = AIOrchestrator.extract_traveller_context(prompt)
    print("\nExtracted Traveller Context:")
    print(json.dumps(context.model_dump(), indent=2))

    print_header("2. DETERMINISTIC CANDIDATE GENERATION & SCORING")
    itinerary = ItineraryEngine.generate_itinerary(context)
    summary = itinerary.tripSummary
    print(f"Trip Summary:")
    print(f"  Estimated Cost: ₹{summary.estimatedCost:,.0f} / Budget: ₹{summary.budget:,.0f}")
    print(f"  Remaining Budget: ₹{summary.remainingBudget:,.0f}")
    print(f"  Preference Match: {summary.preferenceScore}%")
    print(f"  Feasibility Score: {summary.feasibilityScore}%")
    print(f"  Overall Score: {summary.overallScore}/100")

    print_header("3. GENERATED ITINERARY SCHEDULE")
    for day in itinerary.days:
        print(f"\nDay {day.day} — {day.city} ({day.date}) | Cost: ₹{day.dayCost:,.0f}")
        for act in day.activities:
            print(f"  [{act.startTime} - {act.endTime}] {act.name} (₹{act.cost}) - {act.reason}")

    print_header("4. WHY THIS ITINERARY? (NON-CoT EXPLANATION)")
    for factor in itinerary.explanation.get("factors", []):
        print(f"  {factor}")

    print_header("5. DYNAMIC REPLANNING DEMONSTRATION (WEATHER CHANGE)")
    rain_trig = ReplanTrigger(trigger_type="weather_change", rain_probability=90.0)
    replan_res = ReplanningEngine.replan(itinerary, context, rain_trig)
    print(f"Change Summary: {replan_res.summary_change}")
    for diff in replan_res.diffs:
        print(f"  [{diff.action}] {diff.name}: {diff.reason}")

if __name__ == "__main__":
    main()
