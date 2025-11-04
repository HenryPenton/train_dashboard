from src.adapters.file_handlers.json.json_file_read import AbstractFileReader
from src.DAOs.station.station_dao import StationDAO
from src.domain.station.stations import Stations


class StationService:
    def __init__(self, reader: AbstractFileReader[list[StationDAO]]):
        self.reader = reader

    def get_stations(self) -> list[Stations]:
        stations = self.reader.read_json()
        station_models = Stations(stations).sort_by_name()
        return station_models
