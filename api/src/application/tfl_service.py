from src.adapters.clients.tflclient import TFLClient
from src.domain.tfl.routes.routes import AllRoutes
from src.domain.tfl.lines.lines import LineStatusModelList


class TFLService:
    def __init__(self, client: TFLClient):
        self.client = client

    async def get_best_route(self, from_station: str, to_station: str):
        journeys = await self.client.get_possible_route_journeys(
            from_station, to_station
        )

        return AllRoutes(journeys).get_best()

    async def get_line_statuses(self):
        status_DAOs = await self.client.get_all_lines_status()
        model_list = LineStatusModelList(status_DAOs).get_line_statuses()
        return model_list
