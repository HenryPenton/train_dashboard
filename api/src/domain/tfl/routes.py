class BestRoute:
    def __init__(self, best: dict):
        self.duration = best.get("duration")
        self.arrival = best.get("arrivalDateTime")
        self.legs = [
            {
                "mode": leg.get("mode", {}).get("name"),
                "instruction": leg.get("instruction", {}).get("summary"),
                "departure": leg.get("departurePoint", {}).get("commonName"),
                "arrival": leg.get("arrivalPoint", {}).get("commonName"),
                "line": leg.get("routeOptions", [{}])[0].get("name"),
            }
            for leg in best.get("legs", [])
        ]

    def as_dict(self) -> dict:
        return {
            "duration": self.duration,
            "arrival": self.arrival,
            "legs": self.legs,
        }


class AllRoutes:
    def __init__(self, journeys: list[dict]):
        self.journeys = journeys

    def get_best(self) -> dict:
        if not self.journeys:
            return {"error": "No journeys found"}
        best = self.journeys[0]
        return BestRoute(best).as_dict()
