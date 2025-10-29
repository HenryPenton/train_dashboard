from src.DAOs.tfl.route_dao import JourneyDAO


class Route:
    def __init__(self, best: JourneyDAO) -> None:
        self.duration = best.duration
        self.arrival = best.arrival
        self.legs = [
            {
                "mode": leg.mode.name,
                "instruction": leg.instruction.summary,
                "departure": leg.departurePoint.commonName,
                "arrival": leg.arrivalPoint.commonName,
                "line": leg.routeOptions[0].name,
            }
            for leg in best.legs
        ]
        self.fare = best.fare_total_cost

    def as_dict(self) -> dict:
        return {
            "duration": self.duration,
            "arrival": self.arrival,
            "legs": self.legs,
            "fare": self.fare,
        }


class RoutesList:
    def __init__(self, journeys: list[JourneyDAO]) -> None:
        self.journeys = journeys
        self.routes = self._extract_routes()

    def _extract_routes(self) -> list[Route]:
        routes = []
        for journey in self.journeys:
            routes.append(Route(journey))

        return routes

    def get_best_route(self) -> Route:
        if len(self.routes) == 0:
            raise ValueError("No routes available")
        best = self.routes[0]
        return best
