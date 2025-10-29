from src.DAOs.rail.departure_dao import DepartureDAO
from src.domain.rail.departures.departure_parts.departure_station_info import (
    RailDepartureStationInfo,
)


class TestDepartureStationInfo:
    def test_full_departure(self):
        dao = DepartureDAO(
            **{
                "origin": [{"description": "Aberdeen"}],
                "destination": [{"description": "Pitlochry"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
            }
        )
        dep = RailDepartureStationInfo(dao)
        expected = {
            "origin": "Aberdeen",
            "destination": "Pitlochry",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_multi_origin(self):
        dao = DepartureDAO(
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
        dep = RailDepartureStationInfo(dao)
        expected = {
            "origin": "Aberdeen, Oxford",
            "destination": "Pitlochry",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_multi_destination(self):
        dao = DepartureDAO(
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
        dep = RailDepartureStationInfo(dao)
        expected = {
            "origin": "Aberdeen",
            "destination": "Pitlochry, Birmingham",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_early(self):
        dao = DepartureDAO(
            **{
                "origin": [{"description": "Aberdeen"}],
                "destination": [{"description": "Pitlochry"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0929",
            }
        )
        dep = RailDepartureStationInfo(dao)
        expected = {
            "origin": "Aberdeen",
            "destination": "Pitlochry",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_full_departure_on_time(self):
        dao = DepartureDAO(
            **{
                "origin": [{"description": "Aberdeen"}],
                "destination": [{"description": "Pitlochry"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0930",
            }
        )
        dep = RailDepartureStationInfo(dao)
        expected = {
            "origin": "Aberdeen",
            "destination": "Pitlochry",
            "platform": "5",
        }
        assert dep.get_rail_departure_station_info() == expected

    def test_non_standard_time_format(self):
        dao = DepartureDAO(
            **{
                "origin": [],
                "destination": [],
                "gbttBookedDeparture": "930",
                "platform": None,
                "realtimeDeparture": None,
            }
        )
        dep = RailDepartureStationInfo(dao)
        expected = {
            "origin": None,
            "destination": None,
            "platform": '?',
        }
        assert dep.get_rail_departure_station_info() == expected
        assert not dep.is_valid()

    def test_platform_present(self):
        dao = DepartureDAO(
            **{
                "origin": [{"description": "Aberdeen"}],
                "destination": [{"description": "Pitlochry"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0930",
            }
        )
        info = RailDepartureStationInfo(dao)
        assert info.platform == "5"

    def test_platform_none(self):
        dao = DepartureDAO(
            **{
                "origin": [{"description": "Aberdeen"}],
                "destination": [{"description": "Pitlochry"}],
                "gbttBookedDeparture": "0930",
                "platform": None,
                "realtimeDeparture": "0930",
            }
        )
        info = RailDepartureStationInfo(dao)
        assert info.platform == "?"

    def test_platform_missing(self):
        dao = DepartureDAO(
            **{
                "origin": [{"description": "Aberdeen"}],
                "destination": [{"description": "Pitlochry"}],
                "gbttBookedDeparture": "0930",
                "realtimeDeparture": "0930",
            }
        )
        info = RailDepartureStationInfo(dao)
        assert info.platform == "?"
