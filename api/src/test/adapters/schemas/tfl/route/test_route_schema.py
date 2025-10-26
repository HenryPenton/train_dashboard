import pytest
from src.adapters.schemas.tfl.route.route_schema import (
    FareSchema,
    InstructionSchema,
    JourneyRecordSchema,
    LegSchema,
    ModeSchema,
    PointSchema,
    RouteOptionSchema,
)


def valid_mode():
    return {"name": "tube"}


def valid_instruction():
    return {"summary": "Take the tube"}


def valid_point(name):
    return {"commonName": name}


def valid_route_option():
    return {"name": "fastest"}


def valid_leg():
    return {
        "mode": valid_mode(),
        "instruction": valid_instruction(),
        "departurePoint": valid_point("A"),
        "arrivalPoint": valid_point("B"),
        "routeOptions": [valid_route_option()],
    }


def valid_fare():
    return {"totalCost": 320}


def test_journey_record_schema_all_valid():
    schema = JourneyRecordSchema()
    data = {
        "legs": [valid_leg(), valid_leg()],
        "duration": 45,
        "arrivalDateTime": "2025-10-26T10:00:00Z",
        "fare": valid_fare(),
    }
    result = schema.load(data)
    assert len(result["legs"]) == 2
    assert result["duration"] == 45
    assert result["arrivalDateTime"] == "2025-10-26T10:00:00Z"
    assert result["fare"]["totalCost"] == 320


def test_journey_record_schema_missing_fare():
    schema = JourneyRecordSchema()
    data = {
        "legs": [valid_leg()],
        "duration": 30,
        "arrivalDateTime": "2025-10-26T09:00:00Z",
    }
    result = schema.load(data)
    assert result.get("fare") is None


def test_leg_schema_unknown_fields_are_excluded():
    schema = LegSchema()
    data = valid_leg().copy()
    data["unknownField"] = "should be ignored"
    result = schema.load(data)
    assert "unknownField" not in result


def test_fare_schema_none_total_cost():
    schema = FareSchema()
    data = {"totalCost": None}
    result = schema.load(data)
    assert result["totalCost"] is None


def test_mode_schema_missing_name():
    schema = ModeSchema()
    data = {}
    with pytest.raises(Exception):
        schema.load(data)


def test_journey_record_schema_extra_fields():
    schema = JourneyRecordSchema()
    data = {
        "legs": [valid_leg()],
        "duration": 10,
        "arrivalDateTime": "2025-10-26T08:00:00Z",
        "fare": valid_fare(),
        "extraField": "should be ignored",
    }
    result = schema.load(data)
    assert "extraField" not in result
