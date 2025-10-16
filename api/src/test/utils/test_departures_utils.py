from src.utils.departures_utils import get_actual, get_status, process_departures_response, get_origin, get_destination, get_scheduled, get_platform, get_real, parse_time

def test_process_departures_response_empty():
    assert process_departures_response({"services": []}) == []

def test_process_departures_response_missing_fields():
    response_json = {"services": [{}]}
    result = process_departures_response(response_json)
    print(result)
    assert result == []

def test_get_origin():
    loc = {"origin": [{"description": "Reading"}, {"description": "Oxford"}]}
    assert get_origin(loc) == "Reading, Oxford"
    loc = {"origin": []}
    assert get_origin(loc) == ""

def test_get_destination():
    loc = {"destination": [{"description": "London Paddington"}, {"description": "Didcot Parkway"}]}
    assert get_destination(loc) == "London Paddington, Didcot Parkway"
    loc = {"destination": []}
    assert get_destination(loc) == ""

def test_get_scheduled():
    loc = {"gbttBookedDeparture": "1234"}
    assert get_scheduled(loc) == "1234"
    loc = {}
    assert get_scheduled(loc) is None

def test_get_actual():
    actual = get_actual("1234", 5)
    assert actual == "1239"
    actual = get_actual("1234", None)
    assert actual == "1234"
    actual = get_actual(None, 5)
    assert actual is None

def test_get_platform():
    loc = {"platform": "5"}
    assert get_platform(loc) == "5"
    loc = {}
    assert get_platform(loc) is None

def test_get_real():
    loc = {"realtimeDeparture": "1240"}
    assert get_real(loc) == "1240"
    loc = {}
    assert get_real(loc) is None

def test_parse_time():
    assert parse_time("0030") == 30
    assert parse_time("0930") == 570
    assert parse_time("2359") == 1439
    assert parse_time("") is None
    assert parse_time(None) is None
    assert parse_time("093012") == 570


def test_get_status():
    assert get_status(-5) == 'Early'
    assert get_status(0) == 'On time'
    assert get_status(5) == 'Late'
    assert get_status(None) == None
