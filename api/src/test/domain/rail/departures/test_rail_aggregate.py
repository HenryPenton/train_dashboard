from src.domain.rail.departures.rail_aggregate import (
    RailAggregate,
)


class TestMultipleDepartures:
    def test_multiple_departures(self):
        data = {
            "services": [
                {
                    "locationDetail": {
                        "origin": [{"description": "Reading"}],
                        "destination": [{"description": "London Paddington"}],
                        "gbttBookedDeparture": "0930",
                        "platform": "5",
                        "realtimeDeparture": "0935",
                    }
                },
                {
                    "locationDetail": {
                        "origin": [{"description": "Oxford"}],
                        "destination": [{"description": "Manchester"}],
                        "gbttBookedDeparture": "1015",
                        "platform": "2",
                        "realtimeDeparture": "1015",
                    }
                },
                {
                    "locationDetail": {
                        "origin": [{"description": "Bristol"}],
                        "destination": [{"description": "Cardiff"}],
                        "gbttBookedDeparture": "1100",
                        "platform": "1",
                        "realtimeDeparture": "1058",
                    }
                },
            ]
        }
        expected = [
            {
                "actual": "0935",
                "delay": 5,
                "destination": "London Paddington",
                "origin": "Reading",
                "platform": "5",
                "status": "Late",
            },
            {
                "actual": "1015",
                "delay": 0,
                "destination": "Manchester",
                "origin": "Oxford",
                "platform": "2",
                "status": "On time",
            },
            {
                "actual": "1058",
                "delay": -2,
                "destination": "Cardiff",
                "origin": "Bristol",
                "platform": "1",
                "status": "Early",
            },
        ]

        results = RailAggregate(data).get_all_rail_departures()

        assert results == expected
