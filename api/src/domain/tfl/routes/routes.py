from src.adapters.clients.tflclient import JourneyRecord
from src.domain.tfl.routes.best_route.best_route import BestRoute


class AllRoutes:
    def __init__(self, journeys: list[JourneyRecord]):
        self.journeys = journeys

    def get_best(self) -> dict:
        if not self.journeys or len(self.journeys) == 0:
            return {"error": "No journeys found"}
        best = self.journeys[0]
        print(f"{best} best")
        return BestRoute(best).get_best_route_summary()
