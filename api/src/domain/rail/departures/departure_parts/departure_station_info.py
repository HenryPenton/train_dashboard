from src.adapters.clients.rttclient import DepartureRecord
from src.shared.utils.check_group_of_properties_exist import (
    check_group_of_properties_exist,
)


class RailDepartureStationInfo:
    def __init__(self, departure: DepartureRecord) -> None:
        self.origin = self._get_origin(departure)
        self.destination = self._get_destination(departure)
        self.platform = self._get_platform(departure)

    @staticmethod
    def _get_origin(departure: DepartureRecord) -> str | None:
        origins = departure.origins
        if len(origins) == 0:
            return None
        return ", ".join([origin for origin in origins])

    @staticmethod
    def _get_destination(departure: DepartureRecord) -> str | None:
        destinations = departure.destinations
        if len(destinations) == 0:
            return None
        return ", ".join([destination for destination in destinations])

    @staticmethod
    def _get_platform(departure: DepartureRecord) -> str | None:
        return departure.platform

    def is_valid(self) -> bool:
        return check_group_of_properties_exist(
            self.origin,
            self.destination,
            self.platform,
        )

    def get_rail_departure_station_info(self) -> dict:
        return {
            "origin": self.origin,
            "destination": self.destination,
            "platform": self.platform,
        }
