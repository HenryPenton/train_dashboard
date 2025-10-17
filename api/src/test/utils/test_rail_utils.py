from src.utils.rail_utils import (
    get_actual,
    get_status,
    process_departures_response,
    get_origin,
    get_destination,
    get_scheduled,
    get_platform,
    get_real,
    parse_time,
)


class TestProcessDeparturesResponse:
    def test_empty(self):
        assert process_departures_response({"services": []}) == []

    def test_missing_fields(self):
        response_json = {"services": [{}]}
        result = process_departures_response(response_json)
        assert result == []


class TestGetOrigin:
    def test_single_origin(self):
        loc = {"origin": [{"description": "Reading"}]}
        assert get_origin(loc) == "Reading"

    def test_multiple_origins(self):
        loc = {"origin": [{"description": "Reading"}, {"description": "Oxford"}]}
        assert get_origin(loc) == "Reading, Oxford"

    def test_no_origins(self):
        loc = {"origin": []}
        assert get_origin(loc) is None


class TestGetDestination:
    def test_one_destination(self):
        loc = {
            "destination": [
                {"description": "London Paddington"},
            ]
        }
        assert get_destination(loc) == "London Paddington"

    def test_two_destinations(self):
        loc = {
            "destination": [
                {"description": "London Paddington"},
                {"description": "Didcot Parkway"},
            ]
        }
        assert get_destination(loc) == "London Paddington, Didcot Parkway"

    def test_no_destinations(self):
        loc = {"destination": []}
        assert get_destination(loc) is None


class TestGetScheduled:
    def test_with_value(self):
        loc = {"gbttBookedDeparture": "1234"}
        assert get_scheduled(loc) == "1234"

    def test_without_value(self):
        loc = {}
        assert get_scheduled(loc) is None


class TestGetActual:
    def test_with_delay(self):
        actual = get_actual("1234", 5)
        assert actual == "1239"

    def test_without_delay(self):
        actual = get_actual("1234", None)
        assert actual == "1234"

    def test_none_time(self):
        actual = get_actual(None, 5)
        assert actual is None


class TestGetPlatform:
    def test_with_platform(self):
        loc = {"platform": "5"}
        assert get_platform(loc) == "5"

    def test_without_platform(self):
        loc = {}
        assert get_platform(loc) is None


class TestGetReal:
    def test_with_real(self):
        loc = {"realtimeDeparture": "1240"}
        assert get_real(loc) == "1240"

    def test_without_real(self):
        loc = {}
        assert get_real(loc) is None


class TestParseTime:
    def test_0030(self):
        assert parse_time("0030") == 30

    def test_0930(self):
        assert parse_time("0930") == 570

    def test_2359(self):
        assert parse_time("2359") == 1439

    def test_empty(self):
        assert parse_time("") is None

    def test_none(self):
        assert parse_time(None) is None

    def test_long(self):
        assert parse_time("093012") == 570


class TestGetStatus:
    def test_early(self):
        assert get_status(-5) == "Early"

    def test_on_time(self):
        assert get_status(0) == "On time"

    def test_late(self):
        assert get_status(5) == "Late"

    def test_none(self):
        assert get_status(None) is None
