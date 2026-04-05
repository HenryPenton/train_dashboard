from src.adapters.clients.rttclient_v2 import RTTClientV2
from src.domain.rail.departures.rail_departures import RailDepartures


class RailService:
    def __init__(self, client: RTTClientV2):
        self.client = client

    async def get_departures(
        self, origin_station_code: str, destination_station_code: str
    ):
        data = await self.client.get_departures(
            origin_station_code, destination_station_code
        )
        departures = RailDepartures(data).get_all_rail_departures()
        return departures
