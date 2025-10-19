from src.domain.rail.departures.departure_parts.departure_station_info import (
    RailDepartureStationInfo,
)
from src.domain.rail.departures.departure_parts.departure_times import (
    RailDepartureTimes,
)


class RailDepartureAggregate:
    def __init__(self, location_detail: dict):
        self.rail_departure_times = RailDepartureTimes(location_detail)
        self.rail_departure_info = RailDepartureStationInfo(location_detail)

    def get_rail_departure_aggregate(self):
        departure_times = self.rail_departure_times.get_rail_departure_times()
        departure_info = self.rail_departure_info.get_rail_departure_station_info()
        return {**departure_times, **departure_info}

    def is_valid(self):
        return (
            self.rail_departure_times.is_valid() and self.rail_departure_info.is_valid()
        )
