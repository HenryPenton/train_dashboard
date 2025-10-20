import httpx


class RouteRecord:
    def __init__(self, journey: dict):
        self.duration = journey.get("duration")
        self.legs = journey.get("legs", [])

    @staticmethod
    def from_journey(journey: dict):
        return RouteRecord(journey)


class LineRecord:
    def __init__(self, line: dict):
        self.id = line.get("id")
        self.status = line.get("status")

    @staticmethod
    def from_line(line: dict):
        return LineRecord(line)


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

    async def get_best_route(self, from_station: str, to_station: str):
        """
        Fetch the best route from TFL Journey Planner API between two stations.
        :param from_station: Origin station name or code
        :param to_station: Destination station name or code
        :return: JSON response from TFL API
        """
        url = f"{self.api_root}/Journey/JourneyResults/{from_station}/to/{to_station}"
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise TFLClientError(f"TFLClient failed: {str(e)}")

    async def get_all_lines_status(self):
        """
        Fetch the status of all major TFL lines (tube, overground, dlr, elizabeth-line, tram).
        :return: JSON response from TFL API
        """
        url = (
            f"{self.api_root}/Line/Mode/tube,overground,dlr,elizabeth-line,tram/status"
        )
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise TFLClientError(f"TFLClient failed: {str(e)}")
