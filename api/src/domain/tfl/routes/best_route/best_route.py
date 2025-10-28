from src.DAOs.tfl.route_dao import JourneyDAO


class BestRoute:
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

    def get_best_route_summary(self) -> dict:
        return {
            "duration": self.duration,
            "arrival": self.arrival,
            "legs": self.legs,
            "fare": self.fare,
        }
