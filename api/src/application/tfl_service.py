from src.adapters.clients.tflclient import TFLClient
from src.domain.tfl.lines.lines import LineStatusModel, LineStatusModelList
from src.domain.tfl.routes.routes import Route, RoutesList


class TFLService:
    def __init__(self, client: TFLClient, logger):
        self.client = client
        self.logger = logger

    async def get_best_route(self, from_station: str, to_station: str) -> Route:
        self.logger.info(f"Requesting best route from {from_station} to {to_station}")
        route_DAOs = await self.client.get_possible_route_journeys(
            from_station, to_station
        )
        self.logger.debug(f"Received {len(route_DAOs)} possible journeys")
        route_models = RoutesList(route_DAOs, logger=self.logger)
        best = route_models.get_best_route()
        self.logger.info("Best route selected")
        return best

    async def get_line_statuses(self) -> list[LineStatusModel]:
        self.logger.info("Requesting all TfL line statuses")
        status_DAOs = await self.client.get_all_lines_status()
        self.logger.debug(f"Received {len(status_DAOs)} line status DAOs")
        model_list = LineStatusModelList(status_DAOs, logger=self.logger).get_line_statuses()
        self.logger.info("Returning line statuses")
        return model_list
