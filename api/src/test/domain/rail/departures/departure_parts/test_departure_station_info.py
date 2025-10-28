from src.domain.rail.departures.departure_parts.departure_station_info import (
    RailDepartureStationInfo,
)
from src.DAOs.rail.departure_dao import DepartureDAO


class TestDepartureStationInfo:
    def test_full_departure(self):
        model = DepartureDAO(
            **{
                "origin": [{"description": "Aberdeen"}],
                "destination": [{"description": "Pitlochry"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
            }
        )
        dep = RailDepartureStationInfo(model)
        expected = {
            "origin": "Aberdeen",
            "destination": "Pitlochry",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_multi_origin(self):
        model = DepartureDAO(
            **{
                "origin": [
                    {"description": "Aberdeen"},
                    {"description": "Oxford"},
                ],
                "destination": [{"description": "Pitlochry"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
            }
        )
        dep = RailDepartureStationInfo(model)
        expected = {
            "origin": "Aberdeen, Oxford",
            "destination": "Pitlochry",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_multi_destination(self):
        model = DepartureDAO(
            **{
                "origin": [{"description": "Aberdeen"}],
                "destination": [
                    {"description": "Pitlochry"},
                    {"description": "Birmingham"},
                ],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
            }
        )
        dep = RailDepartureStationInfo(model)
        expected = {
            "origin": "Aberdeen",
            "destination": "Pitlochry, Birmingham",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_early(self):
        model = DepartureDAO(
            **{
                "origin": [{"description": "Aberdeen"}],
                "destination": [{"description": "Pitlochry"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0929",
            }
        )
        dep = RailDepartureStationInfo(model)
        expected = {
            "origin": "Aberdeen",
            "destination": "Pitlochry",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_on_time(self):
        model = DepartureDAO(
            **{
                "origin": [{"description": "Aberdeen"}],
                "destination": [{"description": "Pitlochry"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0930",
            }
        )
        dep = RailDepartureStationInfo(model)
        expected = {
            "origin": "Aberdeen",
            "destination": "Pitlochry",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_non_standard_time_format(self):
        model = DepartureDAO(
            **{
                "origin": [],
                "destination": [],
                "gbttBookedDeparture": "930",
                "platform": None,
                "realtimeDeparture": None,
            }
        )
        dep = RailDepartureStationInfo(model)
        expected = {
            "origin": None,
            "destination": None,
            "platform": None,
        }
        assert dep.get_rail_departure_station_info() == expected
        assert not dep.is_valid()
