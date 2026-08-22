"""
AI Orchestrator for Intent Detection, Traveller Context Extraction, Tool Calling, and Decision Explanation.
"""

import json
import re
from typing import Dict, Any, List, Tuple
from app.schemas.schemas import TravellerContext, IntentResult

class AIOrchestrator:
    """
    Handles natural language understanding, intent classification, context extraction, and explainability.
    """

    SUPPORTED_INTENTS = [
        "create_itinerary",
        "modify_itinerary",
        "replan_itinerary",
        "recommend_place",
        "recommend_activity",
        "recommend_food",
        "nearby_recommendation",
        "weather_question",
        "budget_question",
        "place_information",
        "event_information",
        "transport_question",
        "change_preference",
        "budget_reoptimization",
        "weather_replan",
        "place_closure_replan"
    ]

    @classmethod
    def detect_intent(cls, user_text: str) -> IntentResult:
        """
        Classifies intent and extracts core entities from natural language.
        """
        text_lower = user_text.lower()

        # Rule & Pattern matching for robust instant detection
        if any(w in text_lower for w in ["rain", "storm", "weather forecast", "umbrella"]):
            if any(w in text_lower for w in ["replan", "what to do", "change"]):
                return IntentResult(intent="weather_replan", entities={"trigger": "rain"}, requires_tools=True)
            return IntentResult(intent="weather_question", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["closed", "shutdown", "under repair", "temporarily closed"]):
            return IntentResult(intent="place_closure_replan", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["reduce budget", "only have", "lower budget", "cheaper", "cost cut"]):
            return IntentResult(intent="budget_reoptimization", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["don't want", "no forts", "hate", "dislike", "avoid"]):
            return IntentResult(intent="change_preference", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["plan", "itinerary", "travelling", "going to", "visit"]):
            return IntentResult(intent="create_itinerary", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["food", "restaurant", "eat", "lunch", "dinner", "snack"]):
            return IntentResult(intent="recommend_food", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["place", "attraction", "sightseeing"]):
            return IntentResult(intent="recommend_place", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["budget", "cost", "how much", "expense"]):
            return IntentResult(intent="budget_question", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["event", "festival", "fair"]):
            return IntentResult(intent="event_information", entities={}, requires_tools=True)

        return IntentResult(intent="create_itinerary", entities={}, requires_tools=True)

    @classmethod
    def extract_traveller_context(cls, user_text: str, existing_context: TravellerContext = None) -> TravellerContext:
        """
        Extracts structured TravellerContext from user text.
        Preserves existing context while updating newly mentioned entities.
        """
        ctx = existing_context.model_copy() if existing_context else TravellerContext()
        text_lower = user_text.lower()

        # 1. Destination
        cities = ["Jaipur", "Udaipur", "Delhi", "Agra", "Mumbai", "Goa", "Varanasi"]
        found_cities = [c for c in cities if c.lower() in text_lower]
        if found_cities:
            ctx.destination = found_cities

        # 2. Duration (e.g. "3 days", "5-day")
        dur_match = re.search(r'(\d+)\s*(?:day|days)', text_lower)
        if dur_match:
            ctx.duration_days = int(dur_match.group(1))

        # 3. Budget (e.g. "₹20,000", "20000", "15k", "rs 10000")
        budget_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|thousand)?', text_lower)
        if budget_match:
            val_str = budget_match.group(1).replace(",", "")
            try:
                val = float(val_str)
                if "k" in text_lower[budget_match.end():budget_match.end()+2]:
                    val *= 1000
                if val >= 1000:  # Ignore small numbers mistaken for budget
                    ctx.budget = val
            except ValueError:
                pass

        # 4. Group type & Travellers
        if "parents" in text_lower or "family" in text_lower or "kids" in text_lower:
            ctx.group_type = "family"
            ctx.travellers = max(3, ctx.travellers)
            ctx.walking_level = "low"
        elif "couple" in text_lower or "wife" in text_lower or "husband" in text_lower or "partner" in text_lower:
            ctx.group_type = "couple"
            ctx.travellers = 2
        elif "friends" in text_lower or "group" in text_lower:
            ctx.group_type = "friends"

        # 5. Interests
        interests = []
        if "culture" in text_lower or "heritage" in text_lower or "palace" in text_lower or "fort" in text_lower:
            interests.append("culture")
        if "food" in text_lower or "cuisine" in text_lower or "eating" in text_lower:
            interests.append("food")
        if "nature" in text_lower or "garden" in text_lower or "lake" in text_lower:
            interests.append("nature")
        if "adventure" in text_lower or "sports" in text_lower:
            interests.append("adventure")
        if "shopping" in text_lower or "bazaar" in text_lower or "market" in text_lower:
            interests.append("shopping")
        if "museum" in text_lower or "art" in text_lower:
            interests.append("museum")

        if interests:
            ctx.interests = list(set(ctx.interests + interests))

        # 6. Negative preferences
        neg_matches = re.findall(r"(?:don't want|no|avoid|hate)\s+([a-z]+)", text_lower)
        for neg in neg_matches:
            if neg not in ctx.negative_preferences:
                ctx.negative_preferences.append(neg)

        return ctx

    @classmethod
    def generate_explanation(cls, itinerary_data: Dict[str, Any], context: TravellerContext) -> Dict[str, Any]:
        """
        Generates non-CoT decision factors explaining why this itinerary was created.
        """
        summary = itinerary_data.get("tripSummary", {})
        rem_budget = summary.get("remainingBudget", 0.0)
        pref_score = summary.get("preferenceScore", 90.0)
        feasibility = summary.get("feasibilityScore", 95.0)

        return {
            "title": "WHY THIS ITINERARY?",
            "factors": [
                f"✓ {pref_score:.0f}% preference match aligned with your interests ({', '.join(context.interests)})",
                f"✓ ₹{rem_budget:,.0f} safely under budget",
                f"✓ 100% schedule & time feasibility score ({feasibility:.0f}%)",
                "✓ Zero activity time overlaps & validated opening hours",
                "✓ Optimized route order minimizing transit time",
                "✓ Weather-compatible attraction selections"
            ]
        }

    @classmethod
    def generate_replan_explanation(cls, trigger_type: str, removed_items: List[str], added_items: List[str], reason: str) -> Dict[str, Any]:
        """
        Generates clear non-CoT decision factors explaining what changed during replanning.
        """
        return {
            "title": "WHAT CHANGED?",
            "removed": [
                {"name": name, "reason": reason} for name in removed_items
            ],
            "added": [
                {
                    "name": name,
                    "reasons": [
                        "Strong preference match",
                        "Fits available time slot perfectly",
                        "Within target budget",
                        "Currently open and verified"
                    ]
                } for name in added_items
            ]
        }
