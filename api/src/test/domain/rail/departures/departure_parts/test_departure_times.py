from src.domain.rail.departures.departure_parts.departure_times import (
    RailDepartureTimes,
)
from src.DAOs.rail.departure_dao import DepartureDAO


class TestRailDepartureTimes:
    def test_departure_delay_past_midnight(self):
        model = DepartureDAO(
            **{
                "gbttBookedDeparture": "2330",
                "platform": "5",
                "realtimeDeparture": "0005",
                "realtimeArrival": "0100",
                "serviceUid": "EDG123",
                "runDate": "2025-10-29",
            }
        )
        dep = RailDepartureTimes(model)
        expected = {
            "delay": 35,  # 00:05 - 23:30 = 35 minutes
            "status": "Late",
            "actual": "0005",
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure(self):
        model = DepartureDAO(
            **{
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0930",
                "realtimeArrival": "1000",
                "serviceUid": "EDG124",
                "runDate": "2025-10-29",
            }
        )
        dep = RailDepartureTimes(model)
        expected = {
            "delay": 0,
            "status": "On time",
            "actual": "0930",
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_on_time_is_valid(self):
        model = DepartureDAO(
            **{
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "serviceUid": "EDG125",
                "runDate": "2025-10-29",
            }
        )
        dep = RailDepartureTimes(model)
        assert dep.is_valid() is True

    def test_full_departure_multi_origin(self):
        model = DepartureDAO(
            **{
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
                "realtimeArrival": "1005",
                "serviceUid": "EDG126",
                "runDate": "2025-10-29",
            }
        )
        dep = RailDepartureTimes(model)
        expected = {
            "delay": 5,
            "status": "Late",
            "actual": "0935",
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_multi_destination(self):
        model = DepartureDAO(
            **{
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
                "realtimeArrival": "1005",
                "serviceUid": "EDG127",
                "runDate": "2025-10-29",
            }
        )
        dep = RailDepartureTimes(model)
        expected = {
            "delay": 5,
            "status": "Late",
            "actual": "0935",
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_early(self):
        model = DepartureDAO(
            **{
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0929",
                "realtimeArrival": "0955",
                "serviceUid": "EDG128",
                "runDate": "2025-10-29",
            }
        )
        dep = RailDepartureTimes(model)
        expected = {
            "delay": -1,
            "status": "Early",
            "actual": "0929",
        }
        assert dep.get_rail_departure_times() == expected

    def test_full_departure_on_time(self):
        model = DepartureDAO(
            **{
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0930",
                "realtimeArrival": "1000",
                "serviceUid": "EDG129",
                "runDate": "2025-10-29",
            }
        )
        dep = RailDepartureTimes(model)
        expected = {
            "delay": 0,
            "status": "On time",
            "actual": "0930",
        }
        assert dep.get_rail_departure_times() == expected

    def test_overnight_departure(self):
        model = DepartureDAO(
            **{
                "gbttBookedDeparture": "2330",
                "platform": "5",
                "serviceUid": "EDG130",
                "runDate": "2025-10-29",
            }
        )
        dep = RailDepartureTimes(model)
        expected = {
            "delay": 0,
            "status": "On time",
            "actual": "2330",
        }
        assert dep.get_rail_departure_times() == expected

    def test_overnight_departure_with_delay(self):
        model = DepartureDAO(
            **{
                "gbttBookedDeparture": "2330",
                "platform": "5",
                "realtimeDeparture": "2340",
                "realtimeArrival": "0045",
                "serviceUid": "EDG131",
                "runDate": "2025-10-29",
            }
        )
        dep = RailDepartureTimes(model)
        expected = {
            "delay": 10,
            "status": "Late",
            "actual": "2340",
        }
        assert dep.get_rail_departure_times() == expected
