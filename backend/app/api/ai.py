"""
AI API router for Natural Language Intent Detection and Context Extraction.
"""

from fastapi import APIRouter, Body
from typing import Dict, Any
from app.schemas.schemas import TravellerContext, IntentResult
from app.services.ai_orchestrator import AIOrchestrator

router = APIRouter(prefix="/ai", tags=["AI Orchestrator"])

@router.post("/intent", response_model=IntentResult)
def detect_intent(payload: Dict[str, str] = Body(...)):
    """
    Detects intent and extracts query entities from user natural language prompt.
    """
    text = payload.get("text", "")
    return AIOrchestrator.detect_intent(text)

@router.post("/context", response_model=TravellerContext)
def extract_context(payload: Dict[str, Any] = Body(...)):
    """
    Extracts structured TravellerContext JSON from user natural language prompt.
    """
    text = payload.get("text", "")
    existing_raw = payload.get("existing_context", None)
    existing_ctx = TravellerContext(**existing_raw) if existing_raw else None
    return AIOrchestrator.extract_traveller_context(text, existing_ctx)
