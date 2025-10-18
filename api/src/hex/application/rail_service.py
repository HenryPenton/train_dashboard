from src.hex.adapters.clients.rttclient import RTTClient
from src.hex.domain.rail_utils import process_departures_response


class RailService:
    def __init__(self, client: RTTClient):
        self.client = client

    async def get_departures(
        self, origin_station_code: str, destination_station_code: str
    ):
        data = await self.client.get_departures(
            origin_station_code, destination_station_code
        )
        return process_departures_response(data)
