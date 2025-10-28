from src.domain.rail.departures.departure_parts.departure_station_info import (
    RailDepartureStationInfo,
)
from src.domain.rail.departures.departure_parts.departure_times import (
    RailDepartureTimes,
)
from src.models.external_to_python.departure.departure_model import DepartureModel


class RailDepartureAggregate:
    def __init__(self, departure: DepartureModel) -> None:
        self.rail_departure_times = RailDepartureTimes(departure)
        self.rail_departure_info = RailDepartureStationInfo(departure)

    def get_rail_departure(self) -> dict:
        departure_times = self.rail_departure_times.get_rail_departure_times()
        departure_info = self.rail_departure_info.get_rail_departure_station_info()
        return {**departure_times, **departure_info}

    def is_valid(self) -> bool:
        return (
            self.rail_departure_times.is_valid() and self.rail_departure_info.is_valid()
        )
