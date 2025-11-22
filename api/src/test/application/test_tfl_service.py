import asyncio

from src.application.tfl_service import TFLService
from src.DAOs.tfl.line_dao import LineDAO
from src.DAOs.tfl.route_dao import JourneyDAO
from src.DAOs.tfl.arrival_dao import ArrivalDAO
from src.test.utils.dummy_logger import DummyLogger


class DummyTflClient:
    def __init__(self):
        pass

    async def get_possible_route_journeys(self, from_station, to_station):
        return [
            JourneyDAO(
                **{
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
        # Return a list of line dicts as expected by LineDAO
        return [
            LineDAO(
                **{
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

    async def get_arrivals_at_station(self, station_id):
        return [
            ArrivalDAO(
                **{
                    "id": "123",
                    "lineId": "circle",
                    "lineName": "Circle",
                    "platformName": "Platform 1",
                    "timeToStation": 120,
                    "expectedArrival": "2025-11-13T18:12:32Z",
                    "towards": "Edgware Road",
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

    async def get_arrivals_at_station(self, station_id):
        raise Exception("TFL arrivals error")


def test_get_line_status():
    logger = DummyLogger()
    service = TFLService(DummyTflClient(), logger=logger)
    # get_line_status is async, so we need to run it in an event loop
    result = asyncio.run(service.get_line_statuses())
    assert (result[0].as_dict()) == {
        "name": "Central",
        "statusList": ["Good Service"],
        "statusSeverity": 10,
    }


def test_get_line_status_error():
    logger = DummyLogger()
    service = TFLService(FailingTflClient(), logger=logger)
    try:
        asyncio.run(service.get_line_statuses())
        assert False, "Expected Exception"
    except Exception as e:
        assert str(e) == "TFL API error"


def test_get_best_route():
    logger = DummyLogger()
    service = TFLService(DummyTflClient(), logger=logger)
    result = asyncio.run(service.get_best_route("Oxford Circus", "Liverpool Street"))
    assert result.as_dict() == {
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
    logger = DummyLogger()
    service = TFLService(FailingTflClient(), logger=logger)
    try:
        asyncio.run(service.get_best_route("Oxford Circus", "Liverpool Street"))
        assert False, "Expected Exception"
    except Exception as e:
        assert str(e) == "TFL route error"


def test_get_arrivals_by_line():
    logger = DummyLogger()
    service = TFLService(DummyTflClient(), logger=logger)
    result = asyncio.run(service.get_arrivals_by_line("940GZZLUPAC"))
    assert result == {
        "lines": {
            "circle": {
                "lineName": "Circle",
                "arrivals": {
                    "Platform 1": [
                        {
                            "id": "123",
                            "lineId": "circle",
                            "lineName": "Circle",
                            "platformName": "Platform 1",
                            "timeToStation": 120,
                            "expectedArrival": "2025-11-13T18:12:32Z",
                            "towards": "Edgware Road",
                            "currentLocation": None,
                            "destinationName": None,
                            "direction": None,
                        }
                    ]
                },
            }
        }
    }


def test_get_arrivals_by_line_error():
    logger = DummyLogger()
    service = TFLService(FailingTflClient(), logger=logger)
    try:
        asyncio.run(service.get_arrivals_by_line("940GZZLUPAC"))
        assert False, "Expected Exception"
    except Exception as e:
        assert str(e) == "TFL arrivals error"
