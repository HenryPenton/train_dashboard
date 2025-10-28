
from src.DAOs.tfl.line_dao import LineDAO
from src.DAOs.tfl.route_dao import JourneyDAO
import httpx


class TFLClientError(Exception):
    pass


class TFLClient:
    def __init__(self, client: httpx.AsyncClient):
        self.client = client
        self.api_root = "https://api.tfl.gov.uk"

    async def get_possible_route_journeys(
        self, from_station: str, to_station: str
    ) -> list[JourneyDAO]:
        url = f"{self.api_root}/Journey/JourneyResults/{from_station}/to/{to_station}"
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            data = response.json().get("journeys", [])
            journeys = []
            for journey in data:
                journey_dao = JourneyDAO(**journey)
                journeys.append(journey_dao)
            return journeys
        except Exception as e:
            raise TFLClientError(f"TFLClient failed: {str(e)}")

    async def get_all_lines_status(self) -> list[LineDAO]:
        url = (
            f"{self.api_root}/Line/Mode/tube,overground,dlr,elizabeth-line,tram/status"
        )
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            data = response.json()
            return [LineDAO(**line) for line in data]
        except Exception as e:
            raise TFLClientError(f"TFLClient failed: {str(e)}")
