
from src.models.external_to_python.departure.departure_model import DepartureModel
from src.domain.rail.departures.departure_parts.aggregate import RailDepartureAggregate


class RailDepartures:
    def __init__(self, all_services: list[DepartureModel]) -> None:
        self.departures = self._extract_departures(all_services)

    @staticmethod
    def _extract_departures(
        all_services: list[DepartureModel],
    ) -> list[dict]:
        departures = []
        for dep in all_services:
            departure_aggregate = RailDepartureAggregate(dep)
            if departure_aggregate.is_valid():
                departures.append(departure_aggregate.get_rail_departure())
        return departures

    def get_all_rail_departures(self) -> list[dict]:
        return self.departures
