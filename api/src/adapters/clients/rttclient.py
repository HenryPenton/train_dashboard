import os
from typing import List

import httpx


class DepartureRecord:
    def __init__(
        self,
        loc: List[dict],
    ):
        self.origins = DepartureRecord.process_origins(loc.get("origin", []))
        self.destinations = DepartureRecord.process_destinations(
            loc.get("destination", [])
        )
        self.scheduled_departure = loc.get("gbttBookedDeparture")
        self.real_departure = loc.get("realtimeDeparture")
        self.platform = loc.get("platform")

    @staticmethod
    def process_origins(origins: List[dict]) -> List[str]:
        """
        Returns a list of station names from the origins list.
        """
        return [o.get("description", "") for o in origins if isinstance(o, dict)]

    @staticmethod
    def process_destinations(destinations: List[dict]) -> List[str]:
        """
        Returns a list of station names from the destinations list.
        """
        return [d.get("description", "") for d in destinations if isinstance(d, dict)]


class RTTClientError(Exception):
    """Custom exception for RTTClient errors."""

    pass


class RTTClient:
    def __init__(self, client: httpx.AsyncClient):
        """
        Real Time Trains API client.
        :param client: Injected httpx.AsyncClient instance for making async HTTP requests.
        """
        self.client = client

    async def get_departures(
        self, from_station: str, to_station: str
    ) -> List[DepartureRecord]:
        """
        Fetch departures from Real Time Trains API between two stations.
        Returns a list of Departure records.
        """
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
                record = DepartureRecord(loc)
                departures.append(record)
            return departures
        except Exception as e:
            raise RTTClientError(f"RTTClient failed: {str(e)}")
