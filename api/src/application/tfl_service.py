from src.adapters.clients.tflclient import TFLClient
from src.domain.tfl.routes.routes import AllRoutes
from src.domain.tfl.lines.lines import LineStatuses


class TFLService:
    def __init__(self, client: TFLClient):
        self.client = client

    async def get_best_route(self, from_station: str, to_station: str):
        data = await self.client.get_best_route(from_station, to_station)
        journeys = data.get("journeys", [])

        return AllRoutes(journeys).get_best()

    async def get_line_status(self):
        data = await self.client.get_all_lines_status()
        return LineStatuses(data).get_line_statuses()
