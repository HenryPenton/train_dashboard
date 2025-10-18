from src.adapters.clients.tflclient import TFLClient
from src.domain.tfl.best_route import BestRoute
from src.domain.tfl.line_status import LineStatus


class TFLService:
    def __init__(self, client: TFLClient):
        self.client = client

    async def get_best_route(self, from_station: str, to_station: str):
        data = await self.client.get_best_route(from_station, to_station)
        journeys = data.get("journeys", [])
        if not journeys:
            return {"error": "No journeys found"}
        best = journeys[0]
        return BestRoute(best).as_dict()

    async def get_line_status(self):
        data = await self.client.get_all_lines_status()
        return LineStatus(data).as_list()
