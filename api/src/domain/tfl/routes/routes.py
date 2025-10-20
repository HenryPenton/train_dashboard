from src.domain.tfl.routes.best_route.best_route import BestRoute


class AllRoutes:
    def __init__(self, journeys: list[dict]):
        self.journeys = journeys

    def get_best(self) -> dict:
        if not self.journeys:
            return {"error": "No journeys found"}
        best = self.journeys[0]
        return BestRoute(best).get_best_route_summary()
