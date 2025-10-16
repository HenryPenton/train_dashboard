import httpx
from fastapi import HTTPException
import os


class RTTClient:
    def __init__(self, client: httpx.AsyncClient):
        """
        Real Time Trains API client.
        :param client: Injected httpx.AsyncClient instance for making async HTTP requests.
        """
        self.client = client

    async def get_departures(self, from_station: str, to_station: str):
        """
        Fetch departures from Real Time Trains API between two stations.
        :param from_station: Origin station code (e.g., 'PAD')
        :param to_station: Destination station code (e.g., 'RDG')
        :return: JSON response from RTT API
        """
        REALTIME_TRAINS_API_USER = os.getenv("RTT_API_USER", "your_username")
        REALTIME_TRAINS_API_PASS = os.getenv("RTT_API_PASS", "your_password")
        url = f"https://api.rtt.io/api/v1/json/search/{from_station}/to/{to_station}"
        try:
            response = await self.client.get(
                url, auth=(REALTIME_TRAINS_API_USER, REALTIME_TRAINS_API_PASS)
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
