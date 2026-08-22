"""
Place Status Service for operational status validation and closure simulation.
"""

from typing import Dict

class PlaceStatusService:
    _status_overrides: Dict[str, str] = {}

    @classmethod
    def get_status(cls, place_id: str, default_status: str = "open") -> str:
        """Returns effective operational status for a place."""
        return cls._status_overrides.get(place_id, default_status)

    @classmethod
    def set_status(cls, place_id: str, status: str):
        """Simulates place closure or status update (e.g., 'temporarily_closed')."""
        cls._status_overrides[place_id] = status

    @classmethod
    def reset(cls):
        """Resets status overrides."""
        cls._status_overrides.clear()
