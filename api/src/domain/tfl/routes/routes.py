from src.DAOs.tfl.route_dao import JourneyDAO


class Route:
    def __init__(self, best: JourneyDAO, logger) -> None:
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
        self.logger = logger

        self.logger.debug(
            f"Route created: duration={self.duration}, arrival={self.arrival}, fare={self.fare}"
        )

    def as_dict(self) -> dict:
        self.logger.debug("Converting Route to dict")
        return {
            "duration": self.duration,
            "arrival": self.arrival,
            "legs": self.legs,
            "fare": self.fare,
        }


class RoutesList:
    def __init__(self, journeys: list[JourneyDAO], logger) -> None:
        self.journeys = journeys
        self.logger = logger
        self.routes = self._extract_routes()

        self.logger.info(
            f"Extracted {len(self.routes)} routes from {len(self.journeys)} journeys"
        )

    def _extract_routes(self) -> list[Route]:
        routes = []
        for journey in self.journeys:
            routes.append(Route(journey, logger=self.logger))

        self.logger.debug(f"_extract_routes created {len(routes)} routes")
        return routes

    def get_best_route(self) -> Route:
        if len(self.routes) == 0:
            self.logger.error("No routes available")
            raise ValueError("No routes available")
        best = self.routes[0]

        return best
