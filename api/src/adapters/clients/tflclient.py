from src.models.external_to_python.tfl.route.route_model import JourneyModel
import httpx
from src.models.external_to_python.tfl.line.line_model import LineModel


class TFLClientError(Exception):
    pass


class TFLClient:
    def __init__(self, client: httpx.AsyncClient):
        self.client = client
        self.api_root = "https://api.tfl.gov.uk"

    async def get_possible_route_journeys(
        self, from_station: str, to_station: str
    ) -> list[JourneyModel]:
        url = f"{self.api_root}/Journey/JourneyResults/{from_station}/to/{to_station}"
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            data = response.json().get("journeys", [])
            journeys = []
            for journey in data:
                journey_model = JourneyModel(**journey)
                journeys.append(journey_model)
            return journeys
        except Exception as e:
            raise TFLClientError(f"TFLClient failed: {str(e)}")

    async def get_all_lines_status(self) -> list[LineModel]:
        url = (
            f"{self.api_root}/Line/Mode/tube,overground,dlr,elizabeth-line,tram/status"
        )
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            data = response.json()
            return [LineModel(**line) for line in data]
        except Exception as e:
            print(e)
            raise TFLClientError(f"TFLClient failed: {str(e)}")
