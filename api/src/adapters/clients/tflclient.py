import httpx
from src.DAOs.tfl.arrival_dao import ArrivalDAO
from src.DAOs.tfl.line_dao import LineDAO
from src.DAOs.tfl.route_dao import JourneyDAO
from src.shared.models.preference_types import (
    AccessibilityPreference,
    JourneyPreference,
)


class TFLClientError(Exception):
    pass


def build_query_params(params: dict) -> str:
    query_parts = []
    for key, value in params.items():
        query_parts.append(f"{key}={value}")
    return "&".join(query_parts)


class TFLClient:
    def __init__(self, client: httpx.AsyncClient):
        self.client = client
        self.api_root = "https://api.tfl.gov.uk"

    async def get_possible_route_journeys(
        self,
        from_station: str,
        to_station: str,
        accessibility_preference: AccessibilityPreference = None,
        journey_preference: JourneyPreference = None,
    ) -> list[JourneyDAO]:
        base_url = (
            f"{self.api_root}/Journey/JourneyResults/{from_station}/to/{to_station}"
        )

        params = {}
        if accessibility_preference:
            params["accessibilityPreference"] = accessibility_preference.value
        if journey_preference:
            params["journeyPreference"] = journey_preference.value

        query = build_query_params(params)
        url = f"{base_url}?{query}" if query else base_url
        try:
            print(f"Requesting URL: {url}")
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

    async def get_arrivals_at_station(self, station_id: str) -> list[ArrivalDAO]:
        url = f"{self.api_root}/StopPoint/{station_id}/Arrivals"
        try:
            response = await self.client.get(url)
            response.raise_for_status()
            data = response.json()

            return [ArrivalDAO(**arrival) for arrival in data]
        except Exception as e:
            raise TFLClientError(f"TFLClient failed: {str(e)}")
