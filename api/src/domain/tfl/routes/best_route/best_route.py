from src.adapters.clients.tflclient import JourneyRecord


class BestRoute:
    def __init__(self, best: JourneyRecord) -> None:
        self.duration = best.duration
        self.arrival = best.arrival
        self.legs = [
            {
                "mode": leg.get("mode", {}).get("name"),
                "instruction": leg.get("instruction", {}).get("summary"),
                "departure": leg.get("departurePoint", {}).get("commonName"),
                "arrival": leg.get("arrivalPoint", {}).get("commonName"),
                "line": leg.get("routeOptions", [{}])[0].get("name"),
            }
            for leg in best.legs
        ]
        self.fare = best.fare

    def get_best_route_summary(self) -> dict:
        return {
            "duration": self.duration,
            "arrival": self.arrival,
            "legs": self.legs,
            "fare": self.fare,
        }
