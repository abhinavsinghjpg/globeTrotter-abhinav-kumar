"""
GlobeTrotter AI Virtual Tourist Guide CLI Interface.
Integrates the Adaptive AI Travel Decision Engine directly.
"""

import os
import sys

backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.services.ai_orchestrator import AIOrchestrator
from app.services.itinerary_engine import ItineraryEngine
from app.services.replanning_engine import ReplanningEngine
from app.evaluation.evaluator import evaluator

def main():
    print("=" * 65)
    print(" 🌟 GLOBETROTTER AI VIRTUAL TOURIST GUIDE & DECISION ENGINE 🌟")
    print("=" * 65)
    print("Commands:")
    print(" - Type any travel question (e.g. 'Best food in Jaipur', 'Are forts open?')")
    print(" - Type 'plan' for an interactive 3-day itinerary")
    print(" - Type 'guide' to get WhatsApp contact for verified tourist guide")
    print(" - Type 'eval' to run the 30-scenario quantitative AI evaluation suite")
    print(" - Type 'exit' to quit\n")

    current_city = "Jaipur"
    context = None

    while True:
        try:
            user_input = input(f"[{current_city}] You > ").strip()
            if not user_input:
                continue
            if user_input.lower() in ["exit", "quit", "q"]:
                print("Safe travels! Namaste.")
                break
            if user_input.lower() == "eval":
                print("\nRunning 30 scenario benchmark suite...")
                report = evaluator.run_all()
                print(f"Passed: {report.passed_scenarios}/{report.total_scenarios} ({report.passed_scenarios/report.total_scenarios*100:.1f}%)")
                print(f"Budget Compliance: {report.budget_compliance}% | No Conflict: {report.no_conflict_rate}% | Hallucination: {report.hallucination_rate}%\n")
                continue

            res = AIOrchestrator.chat_tourist_guide(
                message=user_input,
                city=current_city,
                existing_context=context
            )
            print("\n🤖 AI Tourist Guide:")
            print(res["reply"])

            if res.get("reasons"):
                print("\n  [Decision Factors]:")
                for r in res["reasons"]:
                    print(f"  ✓ {r}")

            if res.get("action"):
                act = res["action"]
                print(f"\n  👉 Action: {act['label']}")
                print(f"     Link: {act['url']}")

            print("-" * 65 + "\n")

        except (KeyboardInterrupt, EOFError):
            print("\nSession ended.")
            break

if __name__ == "__main__":
    main()
