from src.domain.rail.departures.departure_parts.aggregate import RailDepartureAggregate
from src.DAOs.rail.departure_dao import DepartureDAO


class TestRailDepartureAggregate:
    def test_aggregate_returns_combined_dict(self):
        model = DepartureDAO(
            **{
                "origin": [{"description": "Origin Station"}],
                "destination": [{"description": "Destination Station"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
                "serviceUid": "EDG123",
                "runDate": "2025-10-29",
            }
        )
        aggregate = RailDepartureAggregate(model)
        result = aggregate.as_dict()
        # Check keys from both times and info
        assert "origin" in result
        assert "destination" in result
        assert "platform" in result
        assert "delay" in result
        assert "status" in result
        assert "actual" in result
        assert "url" in result
        assert "gbttBookedDeparture" not in result  # Should be processed
        assert aggregate.is_valid() is True
