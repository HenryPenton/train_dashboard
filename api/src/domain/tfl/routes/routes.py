from src.domain.tfl.routes.best_route.best_route import BestRoute

from src.DAOs.tfl.route_dao import JourneyDAO


class AllRoutes:
    def __init__(self, journeys: list[JourneyDAO]) -> None:
        self.journeys = journeys

    def get_best(self) -> dict:
        if not self.journeys or len(self.journeys) == 0:
            return {"error": "No journeys found"}

        best = self.journeys[0]

        return BestRoute(best).get_best_route_summary()
