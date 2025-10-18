from src.domain.rail.departures.rail_departures import (
    RailDeparture,
)


class TestDeparture:
    def test_full_departure(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "0930",
            "platform": "5",
            "realtimeDeparture": "0935",
        }
        dep = RailDeparture(loc)
        expected = {
            "origin": "Reading",
            "destination": "London Paddington",
            "platform": "5",
            "delay": 5,
            "status": "Late",
            "actual": "0935",
        }
        assert dep.as_dict() == expected

    def test_full_departure_multi_origin(self):
        loc = {
            "origin": [{"description": "Reading"}, {"description": "Oxford"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "0930",
            "platform": "5",
            "realtimeDeparture": "0935",
        }
        dep = RailDeparture(loc)
        expected = {
            "origin": "Reading, Oxford",
            "destination": "London Paddington",
            "platform": "5",
            "delay": 5,
            "status": "Late",
            "actual": "0935",
        }
        assert dep.as_dict() == expected

    def test_full_departure_multi_destination(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [
                {"description": "London Paddington"},
                {"description": "Birmingham"},
            ],
            "gbttBookedDeparture": "0930",
            "platform": "5",
            "realtimeDeparture": "0935",
        }
        dep = RailDeparture(loc)
        expected = {
            "origin": "Reading",
            "destination": "London Paddington, Birmingham",
            "platform": "5",
            "delay": 5,
            "status": "Late",
            "actual": "0935",
        }
        assert dep.as_dict() == expected

    def test_full_departure_early(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "0930",
            "platform": "5",
            "realtimeDeparture": "0929",
        }
        dep = RailDeparture(loc)
        expected = {
            "origin": "Reading",
            "destination": "London Paddington",
            "platform": "5",
            "delay": -1,
            "status": "Early",
            "actual": "0929",
        }
        assert dep.as_dict() == expected

    def test_full_departure_on_time(self):
        loc = {
            "origin": [{"description": "Reading"}],
            "destination": [{"description": "London Paddington"}],
            "gbttBookedDeparture": "0930",
            "platform": "5",
            "realtimeDeparture": "0930",
        }
        dep = RailDeparture(loc)
        expected = {
            "origin": "Reading",
            "destination": "London Paddington",
            "platform": "5",
            "delay": 0,
            "status": "On time",
            "actual": "0930",
        }
        assert dep.as_dict() == expected

    def test_as_departure_missing_fields(self):
        loc = {
            "origin": [],
            "destination": [],
            "gbttBookedDeparture": None,
            "platform": None,
            "realtimeDeparture": None,
        }
        dep = RailDeparture(loc)
        expected = {
            "origin": None,
            "destination": None,
            "platform": None,
            "delay": None,
            "status": None,
            "actual": None,
        }
        assert dep.as_dict() == expected
        assert not dep.is_valid()

    def test_non_standard_time_format(self):
        loc = {
            "origin": [],
            "destination": [],
            "gbttBookedDeparture": "930",
            "platform": None,
            "realtimeDeparture": None,
        }
        dep = RailDeparture(loc)
        expected = {
            "origin": None,
            "destination": None,
            "platform": None,
            "delay": None,
            "status": None,
            "actual": None,
        }
        assert dep.as_dict() == expected
        assert not dep.is_valid()
