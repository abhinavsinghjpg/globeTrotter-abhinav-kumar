"""
Reusable Ollama Service for the Adaptive AI Travel Decision Engine & GlobeTrotter Chatbot.
Handles communication with local Ollama instance with robust prompt construction and fallback.
"""

import json
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, List
from app.core.config import settings

class OllamaService:
    """
    Communicates with local Ollama LLM endpoint (e.g. Llama 3, Mistral, Gemma).
    Provides prompt engineering tailored for Indian travel planning and automated fallback.
    """

    SYSTEM_PROMPT = """You are an expert India travel planning assistant that creates realistic, personalized and geographically sensible travel itineraries.
You have deep knowledge of Indian geography, cultural heritage, cuisine, seasonal weather, state transit routes, train/flight connections, and budget optimization.

Core Guidelines:
1. Always respect user constraints (budget, duration, travelers, food preference, travel style, transit preference).
2. Avoid unrealistic schedules (e.g. do not schedule cross-state travel within a few hours; group geographically close attractions together).
3. Distinguish between known verified information and estimations.
4. Do NOT hallucinate real-time ticket availability or volatile train seat status; label prices and timings as realistic estimates.
5. In conversational mode, be warm, culturally respectful, concise, and helpful. Ask ONLY for missing information when planning a trip."""

    def __init__(self, base_url: Optional[str] = None, model: Optional[str] = None):
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self.model = model or settings.OLLAMA_MODEL

    def is_available(self) -> tuple[bool, str]:
        """
        Checks if Ollama service is reachable.
        """
        try:
            req = urllib.request.Request(f"{self.base_url}/api/tags", method="GET")
            with urllib.request.urlopen(req, timeout=2) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    models = [m.get("name") for m in data.get("models", [])]
                    return True, f"Ollama online with models: {', '.join(models) if models else 'None'}"
        except Exception as e:
            return False, f"Ollama offline ({str(e)})"
        return False, "Ollama unavailable"

    def generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        context_data: Optional[Dict[str, Any]] = None,
        stream: bool = False
    ) -> str:
        """
        Generates text completion using Ollama.
        """
        sys_prompt = system or self.SYSTEM_PROMPT
        if context_data:
            context_str = "\n[RELEVANT TRAVEL KNOWLEDGE BASE CONTEXT]:\n" + json.dumps(context_data, indent=2)
            prompt = f"{prompt}\n\n{context_str}"

        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": sys_prompt,
            "stream": stream,
            "options": {
                "temperature": 0.3,
                "top_p": 0.9
            }
        }

        try:
            req_data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                f"{self.base_url}/api/generate",
                data=req_data,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                if resp.status == 200:
                    res_json = json.loads(resp.read().decode("utf-8"))
                    return res_json.get("response", "").strip()
        except Exception as e:
            # Return empty to allow upstream deterministic fallback
            return ""

    def chat(self, messages: List[Dict[str, str]], context_data: Optional[Dict[str, Any]] = None) -> str:
        """
        Multi-turn chat completion using Ollama /api/chat.
        """
        augmented_messages = [{"role": "system", "content": self.SYSTEM_PROMPT}]
        if context_data:
            augmented_messages.append({
                "role": "system",
                "content": f"Relevant travel database context:\n{json.dumps(context_data, indent=2)}"
            })
        augmented_messages.extend(messages)

        payload = {
            "model": self.model,
            "messages": augmented_messages,
            "stream": False,
            "options": {"temperature": 0.3}
        }

        try:
            req_data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                f"{self.base_url}/api/chat",
                data=req_data,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                if resp.status == 200:
                    res_json = json.loads(resp.read().decode("utf-8"))
                    msg = res_json.get("message", {})
                    return msg.get("content", "").strip()
        except Exception:
            return ""

ollama_service = OllamaService()
