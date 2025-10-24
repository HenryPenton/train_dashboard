import httpx


class LineRecord:
    def __init__(self, line: dict):
        self.id = line.get("id")
        self.name = line.get("name")
        self.line_statuses = line.get("lineStatuses", [])


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


class TFLClientError(Exception):
    """Custom exception for TFLClient errors."""

    pass


class TFLClient:
    def __init__(self, client: httpx.AsyncClient):
        """
        TFL Journey Planner API client.
        :param client: Injected httpx.AsyncClient instance for making async HTTP requests.
        """
        self.client = client
        self.api_root = "https://api.tfl.gov.uk"

    async def get_possible_route_journeys(
        self, from_station: str, to_station: str
    ) -> list[JourneyRecord]:
        """
        Fetch the best route from TFL Journey Planner API between two stations.
        :param from_station: Origin station name or code
        :param to_station: Destination station name or code
        :return: JourneyRecord containing journeys list
        """
        url = f"{self.api_root}/Journey/JourneyResults/{from_station}/to/{to_station}"
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            data = response.json().get("journeys", [])
            journeys = []
            for journey in data:
                journey_record = JourneyRecord(journey)
                journeys.append(journey_record)
            return journeys
        except Exception as e:
            raise TFLClientError(f"TFLClient failed: {str(e)}")

    async def get_all_lines_status(self) -> list[LineRecord]:
        """
        Fetch the status of all major TFL lines (tube, overground, dlr, elizabeth-line, tram).
        :return: List of LineRecord objects
        """
        url = (
            f"{self.api_root}/Line/Mode/tube,overground,dlr,elizabeth-line,tram/status"
        )
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            data = response.json()
            return [LineRecord(line) for line in data]
        except Exception as e:
            raise TFLClientError(f"TFLClient failed: {str(e)}")
