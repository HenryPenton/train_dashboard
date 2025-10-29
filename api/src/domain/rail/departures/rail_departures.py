from src.DAOs.rail.departure_dao import DepartureDAO
from src.domain.rail.departures.departure_parts.aggregate import RailDepartureAggregate


class RailDepartures:
    def __init__(self, all_services: list[DepartureDAO]) -> None:
        self.departures = self._extract_departures(all_services)

    @staticmethod
    def _extract_departures(
        all_services: list[DepartureDAO],
    ) -> list[RailDepartureAggregate]:
        departures = []
        for dep in all_services:
            departure_aggregate = RailDepartureAggregate(dep)
            if departure_aggregate.is_valid():
                departures.append(departure_aggregate)
        return departures

    def get_all_rail_departures(self) -> list[RailDepartureAggregate]:
        return self.departures
