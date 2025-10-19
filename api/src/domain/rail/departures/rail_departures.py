from src.domain.rail.departures.departure_parts.aggregate import RailDepartureAggregate


class RailDepartures:
    def __init__(self, all_services: dict):
        self.departures = self._extract_departures(all_services)

    @staticmethod
    def _extract_departures(all_services: dict) -> list[RailDepartureAggregate]:
        services = all_services.get("services", [])
        departures = []
        for dep in services:
            loc = dep.get("locationDetail", {})
            departure = RailDepartureAggregate(loc)
            if departure.is_valid():
                departures.append(departure.get_rail_departure_aggregate())

        return departures

    def get_all_rail_departures(self) -> list[dict]:
        return self.departures
