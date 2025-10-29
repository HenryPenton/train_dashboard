from src.DAOs.rail.departure_dao import DepartureDAO
from src.domain.rail.departures.rail_departures import (
    RailDepartures,
)


class TestMultipleDepartures:
    def test_multiple_departures(self):
        models = [
            DepartureDAO(
                **{
                    "origin": [{"description": "Edinburgh"}],
                    "destination": [{"description": "Glasgow"}],
                    "gbttBookedDeparture": "0930",
                    "platform": "5",
                    "realtimeDeparture": "0935",
                    "serviceUid": "EDG123",
                    "runDate": "2024-06-01",
                }
            ),
            DepartureDAO(
                **{
                    "origin": [{"description": "Oxford"}],
                    "destination": [{"description": "Manchester"}],
                    "gbttBookedDeparture": "1015",
                    "platform": "2",
                    "realtimeDeparture": "1015",
                    "serviceUid": "OXF456",
                    "runDate": "2024-06-01",
                }
            ),
            DepartureDAO(
                **{
                    "origin": [{"description": "Bristol"}],
                    "destination": [{"description": "Cardiff"}],
                    "gbttBookedDeparture": "1100",
                    "platform": "1",
                    "realtimeDeparture": "1058",
                    "serviceUid": "BRI789",
                    "runDate": "2024-06-01",
                }
            ),
        ]

        results = RailDepartures(models).get_all_rail_departures()

        assert results[0].as_dict() == {
            "actual": "0935",
            "delay": 5,
            "destination": "Glasgow",
            "origin": "Edinburgh",
            "platform": "5",
            "status": "Late",
            "url": "https://www.realtimetrains.co.uk/service/gb-nr:EDG123/2024-06-01",
        }

        assert results[1].as_dict() == {
            "actual": "1015",
            "delay": 0,
            "destination": "Manchester",
            "origin": "Oxford",
            "platform": "2",
            "status": "On time",
            "url": "https://www.realtimetrains.co.uk/service/gb-nr:OXF456/2024-06-01",
        }

        assert results[2].as_dict() == {
            "actual": "1058",
            "delay": -2,
            "destination": "Cardiff",
            "origin": "Bristol",
            "platform": "1",
            "status": "Early",
            "url": "https://www.realtimetrains.co.uk/service/gb-nr:BRI789/2024-06-01",
        }
