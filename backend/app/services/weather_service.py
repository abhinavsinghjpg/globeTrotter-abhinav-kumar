"""
Weather Service providing forecast lookup and dynamic condition simulation.
"""

from typing import Dict, Any

class WeatherService:
    _weather_state: Dict[str, Dict[str, Any]] = {
        "Jaipur": {"condition": "Sunny", "temp_c": 32, "rain_probability": 10.0, "icon": "☀️"},
        "Udaipur": {"condition": "Partly Cloudy", "temp_c": 29, "rain_probability": 20.0, "icon": "⛅"},
        "Delhi": {"condition": "Clear", "temp_c": 34, "rain_probability": 5.0, "icon": "☀️"},
        "Agra": {"condition": "Sunny", "temp_c": 33, "rain_probability": 0.0, "icon": "☀️"}
    }

    @classmethod
    def get_weather(cls, city: str) -> Dict[str, Any]:
        """Gets weather details for a target city."""
        return cls._weather_state.get(city, {"condition": "Sunny", "temp_c": 30, "rain_probability": 0.0, "icon": "☀️"})

    @classmethod
    def set_weather(cls, city: str, condition: str, rain_probability: float):
        """Simulates/Updates weather for a city (e.g. Heavy Rain trigger)."""
        icon = "🌧️" if "rain" in condition.lower() else "☀️"
        cls._weather_state[city] = {
            "condition": condition,
            "temp_c": 24 if "rain" in condition.lower() else 32,
            "rain_probability": rain_probability,
            "icon": icon
        }
