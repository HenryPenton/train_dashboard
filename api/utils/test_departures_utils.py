from utils.departures_utils import process_departures_response

def test_process_departures_response_basic():
    response_json = {
        "services": [
            {
                "locationDetail": {
                    "origin": [{"description": "Reading"}],
                    "destination": [{"description": "London Paddington", "tiploc": "PADTON"}],
                    "gbttBookedDeparture": "1200",
                    "platform": "7",
                    "realtimeDeparture": "1205"
                }
            },
            {
                "locationDetail": {
                    "origin": [{"description": "Reading"}],
                    "destination": [{"description": "Oxford", "tiploc": "OXFD"}],
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
            "origin": "Reading",
            "destination": "London Paddington",
            "scheduled": "1200",
            "platform": "7",
            "delay": 5
        },
        {
            "origin": "Reading",
            "destination": "Oxford",
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
                    "origin": [{"description": "Reading"}],
                    "destination": [{"description": "London Paddington", "tiploc": "PADTON"}],
                    "gbttBookedDeparture": "1200",
                    "platform": "7",
                    "realtimeDeparture": "1205"
                }
            },
            {
                "locationDetail": {
                    "origin": [{"description": "Reading"}],
                    "destination": [{"description": "Oxford", "tiploc": "OXFD"}],
                    "gbttBookedDeparture": "1210",
                    "platform": "8",
                    "realtimeDeparture": "1210"
                }
            }
        ]
    }
    result = process_departures_response(response_json, destination_tiploc="PADTON")
    assert result == [
        {
            "origin": "Reading",
            "destination": "London Paddington",
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
