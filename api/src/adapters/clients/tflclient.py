from src.adapters.schemas.tfl.line.line_schema import LineRecordSchema
from src.domain.models.tfl.line_record import LineRecord
import httpx
from src.adapters.schemas.tfl.route.route_schema import JourneyRecordSchema
from src.domain.models.tfl.journey_record import JourneyRecord


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
                schema = JourneyRecordSchema()
                journey_record = JourneyRecord(schema.dump(journey))
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
            schema = LineRecordSchema()
            return [LineRecord(schema.dump(line)) for line in data]
        except Exception as e:
            raise TFLClientError(f"TFLClient failed: {str(e)}")
