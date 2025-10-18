from src.adapters.clients.rttclient import RTTClient
from api.src.domain.rail.departures.rail_departures import RailDepartures


class RailService:
    def __init__(self, client: RTTClient):
        self.client = client

    async def get_departures(
        self, origin_station_code: str, destination_station_code: str
    ):
        data = await self.client.get_departures(
            origin_station_code, destination_station_code
        )
        departures = RailDepartures(data).get_departures()
        return departures
