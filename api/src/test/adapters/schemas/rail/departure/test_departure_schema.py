from src.adapters.schemas.rail.departure.departure_schema import DepartureRecordSchema


def valid_location(description):
    return {"description": description}


def test_departure_schema_all_valid():
    schema = DepartureRecordSchema()
    data = {
        "origin": [valid_location("London")],
        "destination": [valid_location("Manchester")],
        "gbttBookedDeparture": "10:00",
        "realtimeDeparture": "10:05",
        "platform": "5",
    }
    result = schema.load(data)
    assert result["origin"][0]["description"] == "London"
    assert result["destination"][0]["description"] == "Manchester"
    assert result["gbttBookedDeparture"] == "10:00"
    assert result["realtimeDeparture"] == "10:05"
    assert result["platform"] == "5"


def test_departure_schema_missing_realtime_departure():
    schema = DepartureRecordSchema()
    data = {
        "origin": [valid_location("London")],
        "destination": [valid_location("Manchester")],
        "gbttBookedDeparture": "10:00",
        "platform": "5",
    }
    result = schema.load(data)
    assert result.get("realtimeDeparture") is None


def test_departure_schema_none_realtime_departure():
    schema = DepartureRecordSchema()
    data = {
        "origin": [valid_location("London")],
        "destination": [valid_location("Manchester")],
        "gbttBookedDeparture": "10:00",
        "realtimeDeparture": None,
        "platform": "5",
    }
    result = schema.load(data)
    assert result["realtimeDeparture"] is None


def test_departure_schema_missing_platform():
    schema = DepartureRecordSchema()
    data = {
        "origin": [valid_location("London")],
        "destination": [valid_location("Manchester")],
        "gbttBookedDeparture": "10:00",
        "realtimeDeparture": "10:05",
    }
    result = schema.load(data)
    assert result.get("platform") == "?"


def test_departure_schema_none_platform():
    schema = DepartureRecordSchema()
    data = {
        "origin": [valid_location("London")],
        "destination": [valid_location("Manchester")],
        "gbttBookedDeparture": "10:00",
        "realtimeDeparture": "10:05",
        "platform": None,
    }
    result = schema.load(data)
    assert result.get("platform") == "?"
