import os
from typing import List

import httpx
from src.DAOs.rail.departure_dao import DepartureDAO, DeparturesDAO


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
            data = DeparturesDAO(**response.json())
            departures = []
            for service in data.services:
                serviceType = service.get("serviceType", "")

                # Skip non-train services
                if serviceType != "train":
                    continue

                locationDetail = service.get("locationDetail", {})
                serviceUid = service.get("serviceUid", "")
                runDate = service.get("runDate", "")
                try:
                    departure_dao = DepartureDAO(
                        **locationDetail, serviceUid=serviceUid, runDate=runDate
                    )
                    departures.append(departure_dao)
                except Exception:
                    continue
            return departures
        except Exception as e:
            raise RTTClientError(f"RTTClient failed: {str(e)}")
