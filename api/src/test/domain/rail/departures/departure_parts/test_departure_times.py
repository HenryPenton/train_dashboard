from src.domain.rail.departures.departure_parts.departure_times import (
    RailDepartureTimes,
)


class TestRailDepartureTimes:
    def test_departure_delay_past_midnight(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "2330",
            "gbttBookedArrival": "0030",
            "platform": "5",
            "realtimeDeparture": "0005",
            "realtimeArrival": "0100",
        }
        dep = RailDepartureTimes(loc)
        expected = {
            "delay": 35,  # 00:05 - 23:30 = 35 minutes
            "status": "Late",
            "actual": "0005",
            "duration": 55,  # 01:00 - 00:05 = 55 minutes
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "0930",
            "gbttBookedArrival": "1000",
            "platform": "5",
            "realtimeDeparture": "0930",
            "realtimeArrival": "1000",
        }
        dep = RailDepartureTimes(loc)
        expected = {
            "delay": 0,
            "status": "On time",
            "actual": "0930",
            "duration": 30,
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_on_time_is_valid(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "0930",
            "gbttBookedArrival": "1000",
            "platform": "5",
        }
        dep = RailDepartureTimes(loc)

        assert dep.is_valid() is True

    def test_full_departure_multi_origin(self):
        loc = {
            "origin": [{"description": "Reading"}, {"description": "Oxford"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "0930",
            "gbttBookedArrival": "1000",
            "platform": "5",
            "realtimeDeparture": "0935",
            "realtimeArrival": "1005",
        }
        dep = RailDepartureTimes(loc)
        expected = {
            "delay": 5,
            "status": "Late",
            "actual": "0935",
            "duration": 30,
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_multi_destination(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [
                {"description": "London Paddington"},
                {"description": "Birmingham"},
            ],
            "gbttBookedDeparture": "0930",
            "gbttBookedArrival": "1000",
            "platform": "5",
            "realtimeDeparture": "0935",
            "realtimeArrival": "1005",
        }
        dep = RailDepartureTimes(loc)
        expected = {
            "delay": 5,
            "status": "Late",
            "actual": "0935",
            "duration": 30,
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_early(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "0930",
            "gbttBookedArrival": "1000",
            "platform": "5",
            "realtimeDeparture": "0929",
            "realtimeArrival": "0955",
        }
        dep = RailDepartureTimes(loc)
        expected = {
            "delay": -1,
            "status": "Early",
            "actual": "0929",
            "duration": 26,
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_on_time(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "0930",
            "gbttBookedArrival": "1000",
            "platform": "5",
            "realtimeDeparture": "0930",
            "realtimeArrival": "1000",
        }
        dep = RailDepartureTimes(loc)
        expected = {
            "delay": 0,
            "status": "On time",
            "actual": "0930",
            "duration": 30,
        }
        assert dep.get_rail_departure_times() == expected

    def test_as_departure_missing_fields(self):
        loc = {
            "origin": [],
            "destination": [],
            "gbttBookedDeparture": None,
            "gbttBookedArrival": None,
            "platform": None,
            "realtimeDeparture": None,
            "realtimeArrival": None,
        }
        dep = RailDepartureTimes(loc)
        expected = {
            "delay": None,
            "status": None,
            "actual": None,
            "duration": None,
        }
        assert dep.get_rail_departure_times() == expected
        assert not dep.is_valid()

    def test_overnight_departure(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "2330",
            "gbttBookedArrival": "0030",
            "platform": "5",
        }
        dep = RailDepartureTimes(loc)
        expected = {
            "delay": 0,
            "status": "On time",
            "actual": "2330",
            "duration": 60,
        }
        assert dep.get_rail_departure_times() == expected

    def test_overnight_departure_with_delay(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "2330",
            "gbttBookedArrival": "0030",
            "platform": "5",
            "realtimeDeparture": "2340",
            "realtimeArrival": "0045",
        }
        dep = RailDepartureTimes(loc)
        expected = {
            "delay": 10,
            "status": "Late",
            "actual": "2340",
            "duration": 65,
        }
        assert dep.get_rail_departure_times() == expected
