from src.domain.rail.departures.departure_parts.departure_station_info import (
    RailDepartureStationInfo,
)


class TestDepartureStationInfo:
    def test_full_departure(self):
        loc = {
            "origin": [{"description": "Station Origin"}],
            "destination": [{"description": "Station Destination"}],
            "gbttBookedDeparture": "0930",
            "platform": "5",
            "realtimeDeparture": "0935",
        }
        dep = RailDepartureStationInfo(loc)
        expected = {
            "origin": "Station Origin",
            "destination": "Station Destination",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_multi_origin(self):
        loc = {
            "origin": [{"description": "Station Origin"}, {"description": "Oxford"}],
            "destination": [{"description": "Station Destination"}],
            "gbttBookedDeparture": "0930",
            "platform": "5",
            "realtimeDeparture": "0935",
        }
        dep = RailDepartureStationInfo(loc)
        expected = {
            "origin": "Station Origin, Oxford",
            "destination": "Station Destination",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_multi_destination(self):
        loc = {
            "origin": [{"description": "Station Origin"}],
            "destination": [
                {"description": "Station Destination"},
                {"description": "Birmingham"},
            ],
            "gbttBookedDeparture": "0930",
            "platform": "5",
            "realtimeDeparture": "0935",
        }
        dep = RailDepartureStationInfo(loc)
        expected = {
            "origin": "Station Origin",
            "destination": "Station Destination, Birmingham",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_early(self):
        loc = {
            "origin": [{"description": "Station Origin"}],
            "destination": [{"description": "Station Destination"}],
            "gbttBookedDeparture": "0930",
            "platform": "5",
            "realtimeDeparture": "0929",
        }
        dep = RailDepartureStationInfo(loc)
        expected = {
            "origin": "Station Origin",
            "destination": "Station Destination",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_on_time(self):
        loc = {
            "origin": [{"description": "Station Origin"}],
            "destination": [{"description": "Station Destination"}],
            "gbttBookedDeparture": "0930",
            "platform": "5",
            "realtimeDeparture": "0930",
        }
        dep = RailDepartureStationInfo(loc)
        expected = {
            "origin": "Station Origin",
            "destination": "Station Destination",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_as_departure_missing_fields(self):
        loc = {
            "origin": [],
            "destination": [],
            "gbttBookedDeparture": None,
            "platform": None,
            "realtimeDeparture": None,
        }
        dep = RailDepartureStationInfo(loc)
        expected = {
            "origin": None,
            "destination": None,
            "platform": None,
        }
        assert dep.get_rail_departure_station_info() == expected
        assert not dep.is_valid()

    def test_non_standard_time_format(self):
        loc = {
            "origin": [],
            "destination": [],
            "gbttBookedDeparture": "930",
            "platform": None,
            "realtimeDeparture": None,
        }
        dep = RailDepartureStationInfo(loc)
        expected = {
            "origin": None,
            "destination": None,
            "platform": None,
        }
        assert dep.get_rail_departure_station_info() == expected
        assert not dep.is_valid()
