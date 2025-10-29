import asyncio
import unittest

from src.application.rail_service import RailService
from src.DAOs.rail.departure_dao import DepartureDAO


class TestRailService(unittest.TestCase):
    def test_dummy(self):
        # Replace with real tests
        self.assertTrue(True)


class DummyRailClient:
    async def get_departures(self, origin, destination):
        return [
            DepartureDAO(
                **{
                    "origin": [{"description": "London"}],
                    "destination": [{"description": "Manchester"}],
                    "gbttBookedDeparture": "1000",
                    "realtimeDeparture": "1005",
                    "platform": "1",
                }
            )
        ]


class FailingRailClient:
    async def get_departures(self, origin, destination):
        raise Exception("Rail API error")


def test_get_departures():
    service = RailService(DummyRailClient())
    result = asyncio.run(service.get_departures("origin", "destination"))
    assert result[0].as_dict() == {
        "origin": "London",
        "destination": "Manchester",
        "actual": "1005",
        "delay": 5,
        "status": "Late",
        "platform": "1",
    }


def test_get_departures_error():
    service = RailService(FailingRailClient())
    try:
        asyncio.run(service.get_departures("origin", "destination"))
        assert False, "Expected Exception"
    except Exception as e:
        assert str(e) == "Rail API error"
