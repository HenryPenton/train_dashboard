from src.shared.utils.check_group_of_properties_exist import (
    check_group_of_properties_exist,
)


class RailDepartureStationInfo:
    def __init__(self, location_detail: dict):
        self.origin = self._get_origin(location_detail)
        self.destination = self._get_destination(location_detail)
        self.platform = self._get_platform(location_detail)

    @staticmethod
    def _get_origin(loc):
        origins = loc.get("origin", [])
        if len(origins) == 0:
            return None
        return ", ".join([origin.get("description", "") for origin in origins])

    @staticmethod
    def _get_destination(loc):
        destinations = loc.get("destination", [])
        if len(destinations) == 0:
            return None
        return ", ".join(
            [destination.get("description", "") for destination in destinations]
        )

    @staticmethod
    def _get_platform(loc):
        return loc.get("platform")

    def is_valid(self):
        return check_group_of_properties_exist(
            self.origin,
            self.destination,
            self.platform,
        )

    def get_rail_departure_station_info(self):
        return {
            "origin": self.origin,
            "destination": self.destination,
            "platform": self.platform,
        }
