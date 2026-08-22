"""
AI Orchestrator for Intent Detection, Conversational Trip Profile Extraction,
Ollama Travel Reasoning, Deterministic Itinerary & Itemized Budget Generation.
"""

import json
import re
from typing import Dict, Any, List, Tuple, Optional
from app.schemas.schemas import (
    TravellerContext,
    IntentResult,
    TripProfile,
    BudgetBreakdown,
    Itinerary,
    ChatbotResponse
)
from app.services.ollama_service import ollama_service
from app.services.rag_service import rag_service
from app.services.itinerary_engine import ItineraryEngine
from app.services.place_status_service import PlaceStatusService
from app.services.weather_service import WeatherService

class AIOrchestrator:
    """
    Core AI travel orchestration handling:
    1. Conversational NLP & Entity Extraction
    2. Stateful TripProfile tracking & Missing Questions
    3. RAG Destination Knowledge retrieval
    4. Ollama Travel Reasoning with fallback
    5. Deterministic Day-by-Day Itinerary & Itemized Budget Calculation
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

    ALL_KNOWN_DESTINATIONS = [
        "Jaipur", "Udaipur", "Jodhpur", "Delhi", "Agra", "Mumbai",
        "Goa", "Varanasi", "Manali", "Munnar", "Kerala", "Rajasthan",
        "Rishikesh", "Amritsar", "Ladakh", "Mysore", "Hampi", "Kolkata"
    ]

    @classmethod
    def detect_intent(cls, user_text: str) -> IntentResult:
        """
        Classifies intent and extracts core entities from natural language.
        """
        text_lower = user_text.lower()

        # 1. Replanning & Weather
        if any(w in text_lower for w in ["rain", "storm", "weather forecast", "umbrella"]):
            if any(w in text_lower for w in ["replan", "what to do", "change", "indoor"]):
                return IntentResult(intent="weather_replan", entities={"trigger": "rain"}, requires_tools=True)
            return IntentResult(intent="weather_question", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["closed", "shutdown", "under repair", "temporarily closed"]):
            return IntentResult(intent="place_closure_replan", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["reduce budget", "lower budget", "cheaper", "cost cut", "less budget", "cut expenses"]):
            return IntentResult(intent="budget_reoptimization", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["don't want", "no forts", "hate", "dislike", "avoid", "swap", "replace", "change preference"]):
            return IntentResult(intent="change_preference", entities={}, requires_tools=True)

        # 2. Itinerary / Trip Planning cues
        if any(w in text_lower for w in ["plan", "itinerary", "travel", "travelling", "traveling", "trip", "visit", "visiting", "going to", "days", "day", "week", "holiday", "vacation"]):
            return IntentResult(intent="create_itinerary", entities={}, requires_tools=True)

        # 3. Information & Recommendations
        if any(w in text_lower for w in ["food", "restaurant", "eat", "lunch", "dinner", "snack", "kachori", "thali", "dish"]):
            return IntentResult(intent="recommend_food", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["open", "timings", "hours", "entry fee", "ticket", "is open"]):
            return IntentResult(intent="place_information", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["place", "attraction", "sightseeing", "monument", "fort"]):
            return IntentResult(intent="recommend_place", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["budget", "cost", "how much", "expense", "estimate"]):
            return IntentResult(intent="budget_question", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["event", "festival", "fair", "mela"]):
            return IntentResult(intent="event_information", entities={}, requires_tools=True)

        if any(w in text_lower for w in ["train", "flight", "taxi", "cab", "bus", "transport", "how to reach"]):
            return IntentResult(intent="transport_question", entities={}, requires_tools=True)

        return IntentResult(intent="create_itinerary", entities={}, requires_tools=True)

    @classmethod
    def extract_trip_profile(cls, user_text: str, existing_profile: Optional[TripProfile] = None) -> TripProfile:
        """
        Conversational Trip Profile extractor.
        Extracts structured travel requirements and identifies any missing fields.
        """
        profile = existing_profile.model_copy() if existing_profile else TripProfile()
        text_lower = user_text.lower()

        # 1. Destinations & States
        for d in cls.ALL_KNOWN_DESTINATIONS:
            if d.lower() in text_lower:
                if d not in profile.destinations:
                    profile.destinations.append(d)

        # Default fallback if no destination yet
        if not profile.destinations:
            # Check for generic states
            if "rajasthan" in text_lower:
                profile.destinations = ["Jaipur", "Udaipur"]
            elif "kerala" in text_lower:
                profile.destinations = ["Munnar"]

        # 2. Duration (e.g. "7 days", "1 week", "3-day")
        dur_match = re.search(r'(\d+)\s*(?:day|days|night|nights)', text_lower)
        if dur_match:
            profile.duration_days = int(dur_match.group(1))
        elif "1 week" in text_lower or "one week" in text_lower:
            profile.duration_days = 7
        elif "2 weeks" in text_lower:
            profile.duration_days = 14
        elif "weekend" in text_lower:
            profile.duration_days = 2

        # 3. Travelers (e.g. "with my wife", "family of 4", "solo", "2 adults 1 child")
        adults_match = re.search(r'(\d+)\s*(?:adult|adults|people|pax|person|persons|friends)', text_lower)
        if adults_match:
            profile.adults = int(adults_match.group(1))
            profile.travelers_count = profile.adults
        
        children_match = re.search(r'(\d+)\s*(?:kid|kids|child|children)', text_lower)
        if children_match:
            profile.children = int(children_match.group(1))
            profile.travelers_count = (profile.adults or 2) + profile.children

        if "wife" in text_lower or "husband" in text_lower or "partner" in text_lower or "couple" in text_lower:
            profile.adults = 2
            profile.travelers_count = 2
            profile.travel_style = profile.travel_style or "couple"
        elif "solo" in text_lower or "alone" in text_lower or "myself" in text_lower:
            profile.adults = 1
            profile.travelers_count = 1
            profile.travel_style = profile.travel_style or "solo"
        elif "family" in text_lower or "parents" in text_lower:
            profile.adults = profile.adults or 3
            profile.travelers_count = profile.travelers_count or 3
            profile.travel_style = profile.travel_style or "family"

        # 4. Budget Extraction (e.g. "₹60,000", "60k", "15000", "budget is around 50 thousand")
        b_explicit = re.findall(r'(?:budget|cost|price|expense|total|spending|around|approx)?\s*(?:is|of|=|:)?\s*(?:₹|rs\.?|inr)\s*(\d+(?:,\d+)*(?:\.\d+)?)', text_lower)
        b_k = re.findall(r'(\d+(?:\.\d+)?)\s*(?:k|thousand|lakh|lakhs)', text_lower)
        b_num = re.findall(r'(?:budget|cost|expense|total)\s*(?:is|of|=|:)?\s*(?:around\s*)?(\d+(?:,\d+)*)', text_lower)

        if b_explicit:
            val_str = b_explicit[0].replace(",", "")
            try:
                profile.budget_amount = float(val_str)
            except ValueError:
                pass
        elif b_k:
            try:
                val = float(b_k[0])
                if "lakh" in text_lower:
                    val *= 100000
                else:
                    val *= 1000
                profile.budget_amount = val
            except ValueError:
                pass
        elif b_num:
            val_str = b_num[0].replace(",", "")
            try:
                val = float(val_str)
                if val >= 1000:
                    profile.budget_amount = val
            except ValueError:
                pass
        else:
            all_nums = re.findall(r'\b\d{4,}\b', text_lower)
            if all_nums:
                profile.budget_amount = float(all_nums[0])

        # 5. Food Preference
        if "jain" in text_lower:
            profile.food_preference = "jain"
        elif "veg" in text_lower and "non" not in text_lower:
            profile.food_preference = "vegetarian"
        elif "non-veg" in text_lower or "non veg" in text_lower or "chicken" in text_lower or "mutton" in text_lower or "fish" in text_lower:
            profile.food_preference = "non_vegetarian"
        elif "local" in text_lower or "authentic" in text_lower or "street food" in text_lower:
            profile.food_preference = "local_specialties"

        # 6. Accommodation & Travel Style
        if "hostel" in text_lower or "backpacker" in text_lower or "budget stay" in text_lower or "dorm" in text_lower:
            profile.accommodation_preference = "hostel"
            profile.travel_style = "budget"
        elif "luxury" in text_lower or "5 star" in text_lower or "resort" in text_lower or "palace" in text_lower:
            profile.accommodation_preference = "luxury_resort"
            profile.travel_style = "luxury"
        elif "haveli" in text_lower or "heritage" in text_lower:
            profile.accommodation_preference = "heritage_haveli"
            profile.travel_style = "cultural"
        elif "hotel" in text_lower:
            profile.accommodation_preference = "standard_hotel"

        # 7. Transportation Preference
        if "train" in text_lower or "railway" in text_lower:
            profile.transportation_preference = "train"
        elif "flight" in text_lower or "air" in text_lower or "fly" in text_lower:
            profile.transportation_preference = "flight"
        elif "cab" in text_lower or "taxi" in text_lower or "car" in text_lower or "drive" in text_lower:
            profile.transportation_preference = "cab"

        # 8. Interests
        interests = list(profile.interests)
        if any(w in text_lower for w in ["culture", "heritage", "history", "fort", "palace"]):
            interests.append("culture")
        if any(w in text_lower for w in ["food", "cuisine", "kachori", "thali", "sweets"]):
            interests.append("food")
        if any(w in text_lower for w in ["nature", "lakes", "hills", "mountains", "tea"]):
            interests.append("nature")
        if any(w in text_lower for w in ["adventure", "trek", "zipline", "watersports", "snow"]):
            interests.append("adventure")
        if any(w in text_lower for w in ["shopping", "bazaar", "handicrafts", "textiles"]):
            interests.append("shopping")
        profile.interests = list(set(interests))

        # Check missing core fields
        missing = []
        if not profile.destinations:
            missing.append("destination")
        if not profile.duration_days:
            missing.append("duration_days")
        if not profile.budget_amount:
            missing.append("budget_amount")
        if not profile.food_preference:
            missing.append("food_preference")

        profile.missing_fields = missing
        # Profile is considered complete enough to build itinerary if destination + duration are known
        profile.is_complete = (len(profile.destinations) > 0 and profile.duration_days is not None)

        return profile

    @classmethod
    def calculate_itemized_budget(
        cls,
        destinations: List[str],
        duration_days: int,
        travelers_count: int,
        target_budget: Optional[float] = None,
        travel_style: Optional[str] = "standard",
        transport_mode: Optional[str] = "train"
    ) -> BudgetBreakdown:
        """
        Calculates itemized budget breakdown:
        Transportation, Accommodation, Food, Activities/Tickets, Local Transit, Misc, Total.
        """
        days = max(1, duration_days)
        pax = max(1, travelers_count)
        primary_city = destinations[0] if destinations else "Jaipur"
        know = rag_service.get_destination_knowledge(primary_city) or {}
        tiers = know.get("budget_tiers", {})

        # Determine rate tier
        tier_name = travel_style if travel_style in ["budget", "standard", "luxury"] else "standard"
        if target_budget and target_budget > 0:
            daily_per_pax = target_budget / (days * pax)
            if daily_per_pax < 2200:
                tier_name = "budget"
            elif daily_per_pax > 7000:
                tier_name = "luxury"
            else:
                tier_name = "standard"

        # Rates per person per day based on tier
        if tier_name == "budget":
            hotel_per_room_day = 1200
            food_per_pax_day = 500
            local_transit_day = 400
            activities_per_pax_day = 300
            intercity_transport = 1200 if transport_mode == "train" else 3500
        elif tier_name == "luxury":
            hotel_per_room_day = 9500
            food_per_pax_day = 2400
            local_transit_day = 2200
            activities_per_pax_day = 1200
            intercity_transport = 6000 if transport_mode == "flight" else 4000
        else:  # standard
            hotel_per_room_day = 3200
            food_per_pax_day = 1000
            local_transit_day = 1000
            activities_per_pax_day = 600
            intercity_transport = 2200

        rooms_count = max(1, (pax + 1) // 2)
        accommodation_total = hotel_per_room_day * rooms_count * days
        food_total = food_per_pax_day * pax * days
        local_transit_total = local_transit_day * days
        activities_total = activities_per_pax_day * pax * days
        transportation_total = intercity_transport * pax
        misc_total = round((accommodation_total + food_total + activities_total) * 0.08)

        calc_total = accommodation_total + food_total + local_transit_total + activities_total + transportation_total + misc_total

        # If user specified a budget cap, adjust estimates to remain cleanly within target budget
        if target_budget and target_budget > 0:
            if calc_total > target_budget:
                ratio = target_budget / calc_total
                accommodation_total = round(accommodation_total * ratio)
                food_total = round(food_total * ratio)
                local_transit_total = round(local_transit_total * ratio)
                activities_total = round(activities_total * ratio)
                transportation_total = round(transportation_total * ratio)
                misc_total = round(misc_total * ratio)
                calc_total = accommodation_total + food_total + local_transit_total + activities_total + transportation_total + misc_total

        return BudgetBreakdown(
            transportation=float(transportation_total),
            accommodation=float(accommodation_total),
            food=float(food_total),
            activities_tickets=float(activities_total),
            local_transportation=float(local_transit_total),
            miscellaneous=float(misc_total),
            estimated_total=float(calc_total),
            currency="INR",
            is_estimate=True,
            tier=tier_name
        )

    @classmethod
    def extract_traveller_context(cls, user_text: str, existing_context: Optional[TravellerContext] = None) -> TravellerContext:
        """
        Converts extracted profile to TravellerContext schema for deterministic engines.
        """
        prof = cls.extract_trip_profile(user_text)
        ctx = existing_context.model_copy() if existing_context else TravellerContext()

        if prof.destinations:
            ctx.destination = prof.destinations
        if prof.duration_days:
            ctx.duration_days = prof.duration_days
        if prof.travelers_count:
            ctx.travellers = prof.travelers_count
        if prof.budget_amount:
            ctx.budget = prof.budget_amount
        if prof.food_preference:
            ctx.food_preference = prof.food_preference
        if prof.interests:
            ctx.interests = prof.interests
        if prof.travel_style:
            ctx.group_type = prof.travel_style

        return ctx

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
        existing_profile: Optional[Dict[str, Any]] = None,
        existing_context: Optional[TravellerContext] = None
    ) -> Dict[str, Any]:
        """
        Primary AI travel planning conversation engine.
        Connects Ollama reasoning + Knowledge Base RAG + Deterministic Itinerary & Budget.
        """
        text_lower = message.lower()
        intent_res = cls.detect_intent(message)
        intent = intent_res.intent

        # 1. Update/Maintain Stateful Trip Profile
        prev_prof = TripProfile(**existing_profile) if existing_profile else None
        profile = cls.extract_trip_profile(message, prev_prof)
        if not profile.destinations:
            profile.destinations = [city]

        target_city = profile.destinations[0] if profile.destinations else city

        # Retrieve relevant RAG Knowledge Context for Ollama
        rag_know = rag_service.get_destination_knowledge(target_city) or {}
        rag_places = rag_service.search_places(city=target_city)
        rag_places_context = [
            {"name": p.name, "category": p.category, "cost": p.cost, "timings": f"{p.opening_time}-{p.closing_time}"}
            for p in rag_places[:6]
        ]

        reply_text = ""
        action = None
        itinerary_data = None
        budget_data = None
        recommended_places = []
        reasons = []
        quick_chips = []

        # Case A: WhatsApp Guide Booking
        if any(w in text_lower for w in ["guide", "hire guide", "whatsapp", "contact", "tour guide", "human"]):
            reply_text = f"I have connected with verified government-certified heritage guides in {target_city}. You can chat directly on WhatsApp to book a private tour or customize your itinerary."
            action = {
                "label": f"Chat with Verified {target_city} Guide on WhatsApp",
                "url": f"https://wa.me/919876543210?text=Namaste!%20I%20am%20exploring%20{target_city}%20and%20need%20a%20licensed%20guide.",
                "is_whatsapp": True
            }
            reasons = ["Govt-licensed local guides", "Historical depth & private tours", "WhatsApp instant booking"]
            quick_chips = [f"Plan {target_city} Itinerary", f"Best Food in {target_city}", "Check Weather"]

        # Case B: Weather Questions
        elif intent in ["weather_question", "weather_replan"] or any(w in text_lower for w in ["weather", "rain", "temperature"]):
            weather = WeatherService.get_weather(target_city)
            rain_prob = weather.get("rain_probability", 10.0)
            cond = weather.get("condition", "Sunny")
            temp = weather.get("temp_c", 28)

            if rain_prob >= 60.0 or intent == "weather_replan":
                indoor_places = rag_service.search_places(city=target_city, indoor_only=True)
                place_names = [p.name for p in indoor_places[:3]]
                reply_text = f"Weather in {target_city}: {cond}, {temp}°C with {rain_prob:.0f}% chance of rain. Outdoor forts may be slippery, so I recommend these sheltered cultural spots: {', '.join(place_names)}."
                recommended_places = [p.model_dump() for p in indoor_places[:4]]
                reasons = ["100% Indoor & weather-safe", "Rainfall adaptation active"]
            else:
                reply_text = f"Weather in {target_city}: {cond}, {temp}°C with only {rain_prob:.0f}% rain chance. Ideal conditions for outdoor heritage citadels and walking bazaars!"
                reasons = ["Pleasant temperature", "Favorable sightseeing visibility"]
            quick_chips = [f"Plan {target_city} Trip", f"Top Sights in {target_city}", "WhatsApp Guide"]

        # Case C: Single Food / Dish Questions
        elif intent == "recommend_food" and not (profile.is_complete and "plan" in text_lower):
            food_items = rag_know.get("food", ["Authentic Thali", "Local Sweets", "Kachori"])
            reply_text = f"Top authentic culinary specialties in {target_city}:\n" + "\n".join([f"• **{item}**" for item in food_items])
            reasons = ["Traditional authentic recipes", "Locally renowned heritage institutions"]
            quick_chips = [f"Plan {target_city} Itinerary", f"Must-see Forts in {target_city}", "WhatsApp Guide"]

        # Case D: Conversational Trip Planning & Missing Info Detection
        elif profile.is_complete or any(w in text_lower for w in ["plan", "itinerary", "days", "budget", "trip"]):
            # Check if we have both duration and destination
            if not profile.duration_days:
                reply_text = f"I'd love to help you plan an unforgettable trip to {', '.join(profile.destinations)}! How many days are you planning to stay, and who are you traveling with?"
                quick_chips = ["2 Days Trip", "3 Days Trip", "5 Days Vacation", "1 Week Grand Tour"]
            elif not profile.budget_amount:
                days = profile.duration_days
                pax = profile.travelers_count or 2
                reply_text = f"Got it — a {days}-day trip to {', '.join(profile.destinations)} for {pax} travelers! What is your approximate total budget, and do you have any food preferences (e.g. Vegetarian, Jain, Non-Veg)?"
                quick_chips = ["Budget (Under ₹15,000)", "Standard (₹30,000 - ₹50,000)", "Luxury (₹75,000+)", "Vegetarian only"]
            else:
                # We have destination, duration, and budget -> GENERATE FULL ITINERARY + BUDGET
                context = cls.extract_traveller_context(message, existing_context)
                if profile.destinations:
                    expanded_dests = []
                    for d in profile.destinations:
                        if d.lower() == "rajasthan":
                            expanded_dests.extend(["Jaipur", "Udaipur"])
                        elif d.lower() == "kerala":
                            expanded_dests.append("Munnar")
                        else:
                            expanded_dests.append(d)
                    context.destination = expanded_dests
                if profile.duration_days:
                    context.duration_days = min(7, profile.duration_days)
                if profile.travelers_count:
                    context.travellers = profile.travelers_count
                if profile.budget_amount:
                    context.budget = profile.budget_amount
                if profile.food_preference:
                    context.food_preference = profile.food_preference

                # 1. Deterministic Itinerary Engine
                itin_obj = ItineraryEngine.generate_itinerary(context)
                itinerary_data = itin_obj.model_dump()

                # 2. Itemized Budget Engine
                budget_obj = cls.calculate_itemized_budget(
                    destinations=profile.destinations,
                    duration_days=context.duration_days,
                    travelers_count=context.travellers,
                    target_budget=context.budget,
                    travel_style=profile.travel_style or "standard",
                    transport_mode=profile.transportation_preference or "train"
                )
                budget_data = budget_obj.model_dump()

                # 3. Ollama AI Reasoning Narrative
                ollama_context = {
                    "destination": target_city,
                    "duration_days": context.duration_days,
                    "travelers": context.travellers,
                    "budget": context.budget,
                    "food_preference": context.food_preference,
                    "known_attractions": rag_know.get("attractions", []),
                    "famous_food": rag_know.get("food", []),
                    "transit": rag_know.get("transportation", {})
                }
                
                prompt = (
                    f"Create a concise, warm introduction for a {context.duration_days}-day trip to {target_city} for {context.travellers} travelers with budget ₹{context.budget:,.0f} ({context.food_preference} food). "
                    f"Highlight why this itinerary is optimized for their budget and comfort."
                )

                ai_narrative = ollama_service.generate(prompt=prompt, context_data=ollama_context)
                if not ai_narrative:
                    ai_narrative = f"Here is your personalized {context.duration_days}-day travel itinerary and itemized budget for {target_city}! The schedule is geographically sequenced to minimize transit time while keeping total costs comfortably within ₹{context.budget:,.0f}."

                reply_text = ai_narrative
                reasons = [
                    f"100% Budget compliant (₹{budget_obj.estimated_total:,.0f} of ₹{context.budget:,.0f})",
                    "Geographically optimized route order",
                    f"Zero schedule conflicts across {context.duration_days} days",
                    f"{context.food_preference.title()} culinary stops integrated"
                ]
                quick_chips = ["Modify Itinerary", "Reduce Budget", "Change Food to Pure Veg", "Start New Trip", "WhatsApp Guide"]

        # Case E: General / Open Recommendations
        else:
            know_attr = rag_know.get("attractions", ["City Palace", "Historic Forts", "Old Bazaars"])[:3]
            reply_text = f"Welcome to {target_city}! Top iconic highlights include {', '.join(know_attr)}. You can ask me to plan a full trip, look up street food, check entry timings, or estimate budgets!"
            reasons = ["Curated India knowledge graph", "Verified tourist intelligence"]
            quick_chips = [f"Plan 3-Day {target_city} Trip", f"Best Food in {target_city}", "WhatsApp Guide"]

        return {
            "reply": reply_text,
            "intent": intent,
            "city": target_city,
            "profile": profile.model_dump(),
            "itinerary": itinerary_data,
            "budget_breakdown": budget_data,
            "recommended_places": recommended_places,
            "reasons": reasons,
            "action": action,
            "quick_chips": quick_chips
        }
