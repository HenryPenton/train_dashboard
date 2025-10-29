from src.adapters.clients.tflclient import TFLClient
from src.domain.tfl.lines.lines import LineStatusModelList
from src.domain.tfl.routes.routes import Route, RoutesList


class TFLService:
    def __init__(self, client: TFLClient):
        self.client = client

    async def get_best_route(self, from_station: str, to_station: str) -> Route:
        route_DAOs = await self.client.get_possible_route_journeys(
            from_station, to_station
        )
        route_models = RoutesList(route_DAOs)
        best = route_models.get_best_route()

        return best

    async def get_line_statuses(self) -> list[LineStatusModelList]:
        status_DAOs = await self.client.get_all_lines_status()
        model_list = LineStatusModelList(status_DAOs).get_line_statuses()
        return model_list
