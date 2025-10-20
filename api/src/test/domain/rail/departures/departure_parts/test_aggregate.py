from src.domain.rail.departures.departure_parts.aggregate import RailDepartureAggregate
from src.adapters.clients.rttclient import DepartureRecord


class TestRailDepartureAggregate:
    def test_aggregate_returns_combined_dict(self):
        record = DepartureRecord(
            {
                "origin": [{"description": "Origin Station"}],
                "destination": [{"description": "Destination Station"}],
                "gbttBookedDeparture": "0930",
                "platform": "5",
                "realtimeDeparture": "0935",
            }
        )
        aggregate = RailDepartureAggregate(record)
        result = aggregate.get_rail_departure()
        # Check keys from both times and info
        assert "origin" in result
        assert "destination" in result
        assert "platform" in result
        assert "delay" in result
        assert "status" in result
        assert "actual" in result
        assert "gbttBookedDeparture" not in result  # Should be processed
        assert aggregate.is_valid() is True
