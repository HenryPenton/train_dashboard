
from src.domain.rail.departures.rail import RailDeparture


class RailAggregate:
    def __init__(self, all_services: dict):
        self.departures = self._extract_departures(all_services)

    @staticmethod
    def _extract_departures(all_services: dict) -> list[RailDeparture]:
        services = all_services.get("services", [])
        departures = []
        for dep in services:
            loc = dep.get("locationDetail", {})
            departure = RailDeparture(loc)
            if departure.is_valid():
                departures.append(departure.get_rail_departure())

        return departures

    def get_all_rail_departures(self) -> list[dict]:
        return self.departures
