from utils.departures_utils import process_departures_response

def test_process_departures_response_basic():
    response_json = {
        "services": [
            {
                "locationDetail": {
                    "origin": [{"description": "xxx"}],
                    "destination": [{"description": "yyy", "tiploc": "ccc"}],
                    "gbttBookedDeparture": "1200",
                    "platform": "7",
                    "realtimeDeparture": "1205"
                }
            },
            {
                "locationDetail": {
                    "origin": [{"description": "xxx"}],
                    "destination": [{"description": "bbb", "tiploc": "aaa"}],
                    "gbttBookedDeparture": "1210",
                    "platform": "8",
                    "realtimeDeparture": "1210"
                }
            }
        ]
    }
    result = process_departures_response(response_json)
    assert result == [
        {
            'actual': '1205',
            "origin": "xxx",
            "destination": "yyy",
            "scheduled": "1200",
            "platform": "7",
            "delay": 5
        },
        {
            'actual': '1210',
            "origin": "xxx",
            "destination": "bbb",
            "scheduled": "1210",
            "platform": "8",
            "delay": 0
        }
    ]

def test_process_departures_response_with_tiploc():
    response_json = {
        "services": [
            {
                "locationDetail": {
                    "origin": [{"description": "aaa"}],
                    "destination": [{"description": "bbb", "tiploc": "TEST_TIPLOC"}],
                    "gbttBookedDeparture": "1200",
                    "platform": "7",
                    "realtimeDeparture": "1205"
                }
            },
            {
                "locationDetail": {
                    "origin": [{"description": "aaa"}],
                    "destination": [{"description": "Oxford", "tiploc": "ccc"}],
                    "gbttBookedDeparture": "1210",
                    "platform": "8",
                    "realtimeDeparture": "1210"
                }
            }
        ]
    }
    result = process_departures_response(response_json, destination_tiploc="TEST_TIPLOC")
    assert result == [
        {
            "actual": "1205",
            "origin": "aaa",
            "destination": "bbb",
            "scheduled": "1200",
            "platform": "7",
            "delay": 5
        }
    ]

def test_process_departures_response_empty():
    assert process_departures_response({"services": []}) == []

def test_process_departures_response_missing_fields():
    response_json = {"services": [{}]}
    result = process_departures_response(response_json)
    print(result)
    assert result == []
