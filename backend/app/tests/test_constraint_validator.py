"""
Unit tests for ConstraintValidator.
"""

from app.services.constraint_validator import ConstraintValidator
from app.schemas.schemas import Place

def test_opening_hours_validation():
    place = Place(
        id="p1", name="Museum", city="Jaipur", category="museum",
        description="", cost=100, opening_time="09:00", closing_time="17:00",
        latitude=26.9, longitude=75.8
    )
    
    # Valid time slot
    ok, msg = ConstraintValidator.check_opening_hours("10:00", "12:00", place)
    assert ok is True

    # Invalid: Starts before opening
    ok, msg = ConstraintValidator.check_opening_hours("08:00", "10:00", place)
    assert ok is False

    # Invalid: Ends after closing
    ok, msg = ConstraintValidator.check_opening_hours("16:00", "18:00", place)
    assert ok is False

def test_travel_feasibility():
    # 30 mins gap, 15 mins travel -> OK
    ok, msg = ConstraintValidator.check_travel_feasibility("11:30", "12:00", 15)
    assert ok is True

    # 15 mins gap, 30 mins travel -> Insufficient time
    ok, msg = ConstraintValidator.check_travel_feasibility("11:30", "11:45", 30)
    assert ok is False

def test_budget_validation():
    ok, msg = ConstraintValidator.validate_trip_budget(12000, 15000)
    assert ok is True

    ok, msg = ConstraintValidator.validate_trip_budget(18000, 15000)
    assert ok is False
