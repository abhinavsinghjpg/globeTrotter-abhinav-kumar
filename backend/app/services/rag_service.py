"""
RAG Service for Semantic Retrieval & Structured Metadata Filtering.
"""

import json
import os
import re
from typing import List, Dict, Any, Optional
from app.schemas.schemas import Place

class RAGService:
    def __init__(self, data_path: Optional[str] = None):
        if data_path is None:
            data_path = os.path.join(os.path.dirname(__file__), "..", "data", "travel_data.json")
        
        self.data_path = data_path
        self.all_places: List[Place] = []
        self.city_places: Dict[str, List[Place]] = {}
        self.destinations_knowledge: Dict[str, Any] = {}
        self.load_data()

    def load_data(self):
        """Loads and parses travel data into Place objects and Destination knowledge."""
        if not os.path.exists(self.data_path):
            return

        with open(self.data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.all_places.clear()
        self.city_places.clear()
        self.destinations_knowledge = data.get("destinations_knowledge", {})

        cities_dict = data.get("cities", {})
        for city_name, city_info in cities_dict.items():
            places_list = []
            for p_dict in city_info.get("places", []):
                place_obj = Place(**p_dict)
                self.all_places.append(place_obj)
                places_list.append(place_obj)
            self.city_places[city_name] = places_list

    def get_destination_knowledge(self, destination: str) -> Optional[Dict[str, Any]]:
        """Returns structured travel knowledge for a destination or state."""
        dest_lower = destination.lower()
        for k, v in self.destinations_knowledge.items():
            if k.lower() == dest_lower or v.get("name", "").lower() == dest_lower or v.get("state", "").lower() == dest_lower:
                return v
        return None

    def search_destinations_knowledge(self, query: str) -> List[Dict[str, Any]]:
        """Retrieves matching destination knowledge profiles for multi-city or state queries."""
        q_lower = query.lower()
        results = []
        for k, v in self.destinations_knowledge.items():
            corpus = f"{k} {v.get('state','')} {v.get('region','')} {' '.join(v.get('travel_style',[]))} {' '.join(v.get('attractions',[]))} {' '.join(v.get('food',[]))}".lower()
            if any(term in corpus for term in q_lower.split() if len(term) > 2):
                results.append(v)
        return results if results else list(self.destinations_knowledge.values())[:3]

    def get_place_by_id(self, place_id: str) -> Optional[Place]:
        for p in self.all_places:
            if p.id == place_id:
                return p
        return None

    def search_places(
        self,
        city: Optional[str] = None,
        query: Optional[str] = None,
        category: Optional[str] = None,
        max_cost: Optional[float] = None,
        indoor_only: Optional[bool] = None,
        verification_status: Optional[str] = "verified",
        min_rating: Optional[float] = None
    ) -> List[Place]:
        """
        Metadata filtered semantic search over travel database.
        """
        candidates = self.all_places
        
        # 1. City metadata filter
        if city:
            candidates = [p for p in candidates if p.city.lower() == city.lower()]

        # 2. Category metadata filter
        if category:
            candidates = [p for p in candidates if category.lower() in p.category.lower() or any(category.lower() in t.lower() for t in p.tags)]

        # 3. Cost filter
        if max_cost is not None:
            candidates = [p for p in candidates if p.cost <= max_cost]

        # 4. Indoor filter
        if indoor_only is not None and indoor_only:
            candidates = [p for p in candidates if p.indoor or not p.weather_sensitive]

        # 5. Verification status filter
        if verification_status:
            candidates = [p for p in candidates if p.verification_status.lower() == verification_status.lower()]

        # 6. Rating filter
        if min_rating is not None:
            candidates = [p for p in candidates if p.rating >= min_rating]

        # 7. Semantic Query scoring
        if query:
            query_terms = [t.lower() for t in re.findall(r'\w+', query) if len(t) > 2]
            scored_candidates = []
            for p in candidates:
                text_corpus = f"{p.name} {p.category} {p.description} {' '.join(p.tags)}".lower()
                score = sum(1 for term in query_terms if term in text_corpus)
                if score > 0 or not query_terms:
                    scored_candidates.append((score, p))
            scored_candidates.sort(key=lambda x: x[0], reverse=True)
            return [item[1] for item in scored_candidates]

        return candidates

    def get_place_by_id(self, place_id: str) -> Optional[Place]:
        for p in self.all_places:
            if p.id == place_id:
                return p
        return None

rag_service = RAGService()
