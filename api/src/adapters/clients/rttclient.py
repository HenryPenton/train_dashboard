import os
from typing import List

import httpx
from src.DAOs.rail.departure_dao import DepartureDAO


class RTTClientError(Exception):
    pass


class RTTClient:
    def __init__(self, client: httpx.AsyncClient):
        self.client = client

    async def get_departures(
        self, from_station: str, to_station: str
    ) -> List[DepartureDAO]:
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
                    departure_dao = DepartureDAO(**loc)
                    departures.append(departure_dao)
                except Exception:
                    continue
            return departures
        except Exception as e:
            raise RTTClientError(f"RTTClient failed: {str(e)}")
