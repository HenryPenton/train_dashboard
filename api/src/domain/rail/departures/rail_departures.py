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
            departure_aggregate = RailDepartureAggregate(loc)
            if departure_aggregate.is_valid():
                departures.append(departure_aggregate.get_rail_departure())

        return departures

    def get_all_rail_departures(self) -> list[dict]:
        return self.departures
