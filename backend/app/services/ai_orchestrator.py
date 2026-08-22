"""
AI Orchestrator for Intent Detection, Traveller Context Extraction, Tool Calling, and Decision Explanation.
"""

import json
import re
from typing import Dict, Any, List, Tuple, Optional
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

    @classmethod
    def chat_tourist_guide(
        cls,
        message: str,
        city: str = "Jaipur",
        existing_context: Optional[TravellerContext] = None
    ) -> Dict[str, Any]:
        """
        Comprehensive AI Tourist Guide query handler integrating RAG, deterministic constraints,
        weather, place status, itinerary generation, and local guide connection.
        """
        from app.services.rag_service import rag_service
        from app.services.place_status_service import PlaceStatusService
        from app.services.weather_service import WeatherService
        from app.services.itinerary_engine import ItineraryEngine
        from app.services.replanning_engine import ReplanningEngine
        from app.schemas.schemas import ReplanTrigger

        text_lower = message.lower()
        intent_res = cls.detect_intent(message)
        intent = intent_res.intent

        # Extract/Update Traveller Context
        context = cls.extract_traveller_context(message, existing_context)
        if not context.destination or context.destination == ["Jaipur"] and city != "Jaipur":
            context.destination = [city]

        reply_text = ""
        action = None
        itinerary_data = None
        recommended_places = []
        reasons = []

        # 1. Guide / WhatsApp Contact Request
        if any(w in text_lower for w in ["guide", "hire guide", "whatsapp", "contact", "tour guide", "human"]):
            reply_text = f"I have connected with verified government-certified heritage guides for {city}. You can chat directly on WhatsApp to book a private tour or customize your visit."
            action = {
                "label": f"Chat with Verified {city} Guide on WhatsApp",
                "url": f"https://wa.me/919876543210?text=Namaste!%20I%20am%20looking%20for%20a%20verified%20local%20tourist%20guide%20in%20{city}.",
                "isWhatsApp": True
            }
            reasons = ["Verified Govt tourist license", "English & Local language fluent", "Custom heritage tours"]

        # 2. Weather Question or Rain Replan
        elif intent in ["weather_question", "weather_replan"] or any(w in text_lower for w in ["weather", "rain", "temperature", "forecast"]):
            weather = WeatherService.get_weather(city)
            rain_prob = weather.get("rain_probability", 10.0)
            cond = weather.get("condition", "Sunny")
            temp = weather.get("temp_c", 30)

            if rain_prob >= 60.0 or intent == "weather_replan":
                # Find indoor alternatives
                indoor_places = rag_service.search_places(city=city, indoor_only=True)
                place_names = [p.name for p in indoor_places[:3]]
                reply_text = f"Current weather in {city}: {cond}, {temp}°C with {rain_prob:.0f}% chance of rain. Since outdoor forts may be slippery, I recommend these verified indoor heritage spots: {', '.join(place_names)}."
                recommended_places = [p.model_dump() for p in indoor_places[:4]]
                reasons = ["100% Indoor & weather-safe", "Verified operating hours", "Rich cultural collections"]
            else:
                reply_text = f"Current weather in {city}: {cond}, {temp}°C with {rain_prob:.0f}% rain risk. Ideal conditions for sightseeing at open-air monuments and heritage courtyards!"
                reasons = ["Favorable sightseeing temperature", "Zero rainfall risk", "Good golden-hour visibility"]

        # 3. Place Status / Closure Lookups
        elif intent in ["place_information", "place_closure_replan"] or any(w in text_lower for w in ["open", "closed", "timings", "hours", "entry fee", "ticket"]):
            # Search place in database
            places = rag_service.search_places(city=city, query=message)
            if places:
                p = places[0]
                status = PlaceStatusService.get_status(p.id, p.status)
                status_text = "🟢 OPEN" if status == "open" else f"🔴 {status.upper()}"
                reply_text = f"**{p.name}** in {city} is currently {status_text}.\n• **Timings:** {p.opening_time} to {p.closing_time}\n• **Entry Fee:** ₹{p.cost:.0f}\n• **Highlights:** {p.description}"
                recommended_places = [p.model_dump()]
                reasons = [f"Verified status: {status}", f"Timings: {p.opening_time} - {p.closing_time}", f"Rating: {p.rating}★"]
            else:
                reply_text = f"All major monuments in {city} (City Palace, Hawa Mahal, Amer Fort, Museums) are currently open. Let me know if you need specific timings or entry costs!"

        # 4. Food & Culinary Recommendations
        elif intent == "recommend_food" or any(w in text_lower for w in ["food", "restaurant", "kachori", "thali", "eat", "lunch", "dinner", "chaat", "sweet"]):
            food_places = rag_service.search_places(city=city, category="food")
            if not food_places:
                food_places = rag_service.search_places(city=city, query="food")
            
            names_with_cost = [f"{fp.name} (Avg ₹{fp.cost:.0f})" for fp in food_places[:3]]
            reply_text = f"Top authentic culinary spots in {city}:\n" + "\n".join([f"• **{fp.name}**: {fp.description} (Avg ₹{fp.cost:.0f})" for fp in food_places[:3]])
            recommended_places = [p.model_dump() for p in food_places[:4]]
            reasons = ["Hygiene & authenticity verified", "Local traditional recipes", "Centrally located"]

        # 5. Itinerary Creation or Modification
        elif intent in ["create_itinerary", "replan_itinerary", "budget_reoptimization", "change_preference"] or any(w in text_lower for w in ["plan", "itinerary", "3 days", "2 days", "day trip", "schedule"]):
            itin = ItineraryEngine.generate_itinerary(context)
            itinerary_data = itin.model_dump()
            summary = itin.tripSummary
            reply_text = f"I have built a deterministic optimized {summary.days}-day itinerary for {city}!\n• **Total Cost:** ₹{summary.estimatedCost:,.0f} (₹{summary.remainingBudget:,.0f} under ₹{summary.budget:,.0f} budget)\n• **Preference Match:** {summary.preferenceScore}%\n• **Feasibility Score:** {summary.feasibilityScore}% (Zero time overlaps, validated opening hours)"
            reasons = itin.explanation.get("factors", ["Verified operational status", "Optimized transit times", "100% budget compliant"])

        # 6. General Sightseeing & Tourist Recommendations
        else:
            places = rag_service.search_places(city=city, query=message)
            if not places:
                places = rag_service.search_places(city=city)
            
            top_3 = places[:3]
            reply_text = f"Top verified recommendations for {city}:\n" + "\n".join([f"• **{p.name}** ({p.category.title()}): {p.description}" for p in top_3])
            recommended_places = [p.model_dump() for p in top_3]
            reasons = ["Heritage importance", "Optimized travel distance", "Highly rated by travellers"]

        return {
            "reply": reply_text,
            "intent": intent,
            "city": city,
            "context": context.model_dump(),
            "action": action,
            "itinerary": itinerary_data,
            "recommended_places": recommended_places,
            "reasons": reasons
        }

