from src.application.tfl_service import TFLService
from src.adapters.clients.tflclient import LineRecord

import asyncio


class DummyTflClient:
    def __init__(self):
        pass

    async def get_possible_route_journeys(self, from_station, to_station):
        from src.adapters.clients.tflclient import JourneyRecord

        return [
            JourneyRecord(
                {
                    "legs": [
                        {
                            "mode": {"name": "tube"},
                            "instruction": {"summary": "Take the Central Line"},
                            "departurePoint": {"commonName": "Oxford Circus"},
                            "arrivalPoint": {"commonName": "Liverpool Street"},
                            "routeOptions": [{"name": "Central"}],
                        }
                    ],
                    "duration": 15,
                    "fare": {"totalCost": 300},
                    "arrivalDateTime": "2025-10-22T10:00:00Z",
                }
            )
        ]

    async def get_all_lines_status(self):
        # Return a list of line dicts as expected by LineRecord
        return [
            LineRecord(
                {
                    "id": "central",
                    "name": "Central",
                    "lineStatuses": [
                        {
                            "statusSeverity": 10,
                            "statusSeverityDescription": "Good Service",
                        }
                    ],
                }
            )
        ]


class FailingTflClient:
    def __init__(self):
        pass

    async def get_all_lines_status(self):
        raise Exception("TFL API error")

    async def get_possible_route_journeys(self, from_station, to_station):
        raise Exception("TFL route error")


def test_get_line_status():
    service = TFLService(DummyTflClient())
    # get_line_status is async, so we need to run it in an event loop
    result = asyncio.run(service.get_line_status())
    assert result == [
        {"name": "Central", "status": "Good Service", "statusSeverity": 10}
    ]


def test_get_line_status_error():
    service = TFLService(FailingTflClient())
    try:
        asyncio.run(service.get_line_status())
        assert False, "Expected Exception"
    except Exception as e:
        assert str(e) == "TFL API error"


def test_get_best_route():
    service = TFLService(DummyTflClient())
    result = asyncio.run(service.get_best_route("Oxford Circus", "Liverpool Street"))
    assert result == {
        "duration": 15,
        "arrival": "2025-10-22T10:00:00Z",
        "fare": 300,
        "legs": [
            {
                "mode": "tube",
                "instruction": "Take the Central Line",
                "departure": "Oxford Circus",
                "arrival": "Liverpool Street",
                "line": "Central",
            }
        ],
    }


def test_get_best_route_error():
    service = TFLService(FailingTflClient())
    try:
        asyncio.run(service.get_best_route("Oxford Circus", "Liverpool Street"))
        assert False, "Expected Exception"
    except Exception as e:
        assert str(e) == "TFL route error"
