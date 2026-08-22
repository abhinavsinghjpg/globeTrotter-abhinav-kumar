"""
GlobeTrotter AI Travel & Virtual Tourist Guide CLI Interface.
Conversational trip planning powered by Ollama, Knowledge Base RAG, and Itemized Budgeting.
"""

import os
import sys

backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.services.ai_orchestrator import AIOrchestrator
from app.evaluation.evaluator import evaluator
from app.services.ollama_service import ollama_service

def main():
    is_ollama, ollama_msg = ollama_service.is_available()
    print("=" * 68)
    print(" 🌟 GLOBETROTTER AI TRAVEL PLANNER & TOURIST GUIDE (OLLAMA) 🌟")
    print("=" * 68)
    print(f" Status: {ollama_msg}")
    print("\nCapabilities:")
    print(" • Plan trips conversationally (e.g. '7 days in Rajasthan for 2, budget ₹60,000, veg food')")
    print(" • Real-time Day-by-Day itineraries with Itemized Budget Breakdowns")
    print(" • Local street food, sunset points, live monument status & WhatsApp guides")
    print(" • Type 'eval' to run the 30-scenario quantitative AI evaluation suite")
    print(" • Type 'reset' to start a new trip profile | 'exit' to quit\n")

    current_city = "Jaipur"
    profile = None

    while True:
        try:
            user_input = input(f"[{current_city}] You > ").strip()
            if not user_input:
                continue
            if user_input.lower() in ["exit", "quit", "q"]:
                print("\nSafe travels across India! Namaste 🙏")
                break
            if user_input.lower() in ["reset", "new trip"]:
                profile = None
                print("Trip profile reset. Where would you like to travel next?\n")
                continue
            if user_input.lower() == "eval":
                print("\nRunning 30 scenario quantitative AI benchmark suite...")
                report = evaluator.run_all()
                print(f"Passed: {report.passed_scenarios}/{report.total_scenarios} ({report.passed_scenarios/report.total_scenarios*100:.1f}%)")
                print(f"Budget Compliance: {report.budget_compliance}% | No Conflict: {report.no_conflict_rate}% | Hallucination: {report.hallucination_rate}%\n")
                continue

            res = AIOrchestrator.chat_tourist_guide(
                message=user_input,
                city=current_city,
                existing_profile=profile
            )

            profile = res.get("profile", profile)
            if profile and profile.get("destinations"):
                current_city = profile["destinations"][0]

            print("\n🤖 AI Travel Assistant:")
            print(res["reply"])

            # 1. Day-by-Day Itinerary Schedule
            itin = res.get("itinerary")
            if itin and itin.get("days"):
                print("\n" + "=" * 55)
                print(f" 📅 DAY-BY-DAY ITINERARY ({len(itin['days'])} DAYS)")
                print("=" * 55)
                for day in itin["days"]:
                    print(f"\nDAY {day['day']} — {day['city'].upper()} (Est. Cost: ₹{day['dayCost']:,.0f})")
                    for act in day.get("activities", []):
                        print(f"  • [{act['startTime']} - {act['endTime']}] {act['name']} (₹{act['cost']:,.0f}) - {act['category'].title()}")

            # 2. Itemized Budget Breakdown
            budget = res.get("budget_breakdown")
            if budget:
                print("\n" + "=" * 55)
                print(" 💰 ITEMIZED BUDGET BREAKDOWN (ESTIMATE)")
                print("=" * 55)
                print(f"  • Intercity Transportation : ₹{budget['transportation']:,.0f}")
                print(f"  • Accommodation            : ₹{budget['accommodation']:,.0f}")
                print(f"  • Meals & Food             : ₹{budget['food']:,.0f}")
                print(f"  • Activities & Tickets     : ₹{budget['activities_tickets']:,.0f}")
                print(f"  • Local Transit & Cabs     : ₹{budget['local_transportation']:,.0f}")
                print(f"  • Miscellaneous Buffer (8%): ₹{budget['miscellaneous']:,.0f}")
                print("  " + "-" * 51)
                print(f"  TOTAL ESTIMATED COST       : ₹{budget['estimated_total']:,.0f}")

            # 3. Decision Factors
            if res.get("reasons"):
                print("\n  [Verified Factors]:")
                for r in res["reasons"]:
                    print(f"  ✓ {r}")

            # 4. Action (e.g. WhatsApp Guide)
            if res.get("action"):
                act = res["action"]
                print(f"\n  👉 {act['label']}")
                print(f"     URL: {act['url']}")

            # 5. Quick Chips
            if res.get("quick_chips"):
                print(f"\n  [Quick Suggestions]: {' | '.join(res['quick_chips'])}")

            print("-" * 68 + "\n")

        except (KeyboardInterrupt, EOFError):
            print("\nSession ended.")
            break

if __name__ == "__main__":
    main()
