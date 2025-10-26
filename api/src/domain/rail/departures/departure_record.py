from typing import List


class DepartureRecord:
    def __init__(
        self,
        loc: List[dict],
    ):
        self.origins = DepartureRecord.process_origins(loc.get("origin", []))
        self.destinations = DepartureRecord.process_destinations(
            loc.get("destination", [])
        )
        self.scheduled_departure = loc.get("gbttBookedDeparture")
        self.real_departure = loc.get("realtimeDeparture")
        self.platform = loc.get("platform")

    @staticmethod
    def process_origins(origins: List[dict]) -> List[str]:
        """
        Returns a list of station names from the origins list.
        """
        return [o.get("description", "") for o in origins if isinstance(o, dict)]

    @staticmethod
    def process_destinations(destinations: List[dict]) -> List[str]:
        """
        Returns a list of station names from the destinations list.
        """
        return [d.get("description", "") for d in destinations if isinstance(d, dict)]
