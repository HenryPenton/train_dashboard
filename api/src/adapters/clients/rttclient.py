import os
from typing import List

import httpx
from src.adapters.clients.rtt_mapper import RTTMapper
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
            return RTTMapper.to_departure_dao_list(response.json())
        except Exception as e:
            raise RTTClientError(f"RTTClient failed: {str(e)}")
