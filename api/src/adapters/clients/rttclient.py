import os
from typing import List

import httpx
from src.models.external_to_python.departure.departure_model import DepartureModel


class RTTClientError(Exception):
    pass


class RTTClient:
    def __init__(self, client: httpx.AsyncClient):
        self.client = client

    async def get_departures(
        self, from_station: str, to_station: str
    ) -> List[DepartureModel]:
        REALTIME_TRAINS_API_USER = os.getenv("RTT_API_USER", "your_username")
        REALTIME_TRAINS_API_PASS = os.getenv("RTT_API_PASS", "your_password")
        url = f"https://api.rtt.io/api/v1/json/search/{from_station}/to/{to_station}"
        try:
            response = await self.client.get(
                url, auth=(REALTIME_TRAINS_API_USER, REALTIME_TRAINS_API_PASS)
            )
            response.raise_for_status()
            data = response.json()
            departures = []
            for service in data.get("services", []):
                loc = service.get("locationDetail", {})
                try:
                    departure_data = DepartureModel(**loc)
                    departures.append(departure_data)
                except Exception as e:
                    print(e)
                    continue
            return departures
        except Exception as e:
            raise RTTClientError(f"RTTClient failed: {str(e)}")
