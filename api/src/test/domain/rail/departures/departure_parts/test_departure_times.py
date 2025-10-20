from src.domain.rail.departures.departure_parts.departure_times import (
    RailDepartureTimes,
)
from src.adapters.clients.rttclient import DepartureRecord


class TestRailDepartureTimes:
    def test_departure_delay_past_midnight(self):
        record = DepartureRecord(
            {
                "gbttBookedDeparture": "2330",
                "platform": "5",
                "realtimeDeparture": "0005",
                "realtimeArrival": "0100",
            }
        )
        dep = RailDepartureTimes(record)
        expected = {
            "delay": 35,  # 00:05 - 23:30 = 35 minutes
            "status": "Late",
            "actual": "0005",
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure(self):
        record = DepartureRecord(
            {
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0930",
                "realtimeArrival": "1000",
            }
        )
        dep = RailDepartureTimes(record)
        expected = {
            "delay": 0,
            "status": "On time",
            "actual": "0930",
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_on_time_is_valid(self):
        record = DepartureRecord(
            {
                "gbttBookedDeparture": "0930",
                "platform": "5",
            }
        )
        dep = RailDepartureTimes(record)
        assert dep.is_valid() is True

    def test_full_departure_multi_origin(self):
        record = DepartureRecord(
            {
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
                "realtimeArrival": "1005",
            }
        )
        dep = RailDepartureTimes(record)
        expected = {
            "delay": 5,
            "status": "Late",
            "actual": "0935",
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_multi_destination(self):
        record = DepartureRecord(
            {
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
                "realtimeArrival": "1005",
            }
        )
        dep = RailDepartureTimes(record)
        expected = {
            "delay": 5,
            "status": "Late",
            "actual": "0935",
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_early(self):
        record = DepartureRecord(
            {
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0929",
                "realtimeArrival": "0955",
            }
        )
        dep = RailDepartureTimes(record)
        expected = {
            "delay": -1,
            "status": "Early",
            "actual": "0929",
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_on_time(self):
        record = DepartureRecord(
            {
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0930",
                "realtimeArrival": "1000",
            }
        )
        dep = RailDepartureTimes(record)
        expected = {
            "delay": 0,
            "status": "On time",
            "actual": "0930",
        }
        assert dep.get_rail_departure_times() == expected

    def test_as_departure_missing_fields(self):
        record = DepartureRecord(
            {
                "origin": [],
                "destination": [],
                "gbttBookedDeparture": None,
                "platform": None,
                "realtimeDeparture": None,
                "realtimeArrival": None,
            }
        )
        dep = RailDepartureTimes(record)
        expected = {
            "delay": None,
            "status": None,
            "actual": None,
        }
        assert dep.get_rail_departure_times() == expected
        assert not dep.is_valid()

    def test_overnight_departure(self):
        record = DepartureRecord(
            {
                "gbttBookedDeparture": "2330",
                "platform": "5",
            }
        )
        dep = RailDepartureTimes(record)
        expected = {
            "delay": 0,
            "status": "On time",
            "actual": "2330",
        }
        assert dep.get_rail_departure_times() == expected

    def test_overnight_departure_with_delay(self):
        record = DepartureRecord(
            {
                "gbttBookedDeparture": "2330",
                "platform": "5",
                "realtimeDeparture": "2340",
                "realtimeArrival": "0045",
            }
        )
        dep = RailDepartureTimes(record)
        expected = {
            "delay": 10,
            "status": "Late",
            "actual": "2340",
        }
        assert dep.get_rail_departure_times() == expected
