class JourneyRecord:
    def __init__(self, journey: dict):
        self.legs = journey.get("legs", [])
        self.duration = journey.get("duration")
        self.arrival = journey.get("arrivalDateTime")
        self.fare = self._get_fare_total_cost(journey)

    @staticmethod
    def _get_fare_total_cost(journey: dict) -> int | None:
        fare = journey.get("fare", {})
        return fare.get("totalCost")
