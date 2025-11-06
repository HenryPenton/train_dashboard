from src.adapters.file_handlers.json.json_file_read import AbstractFileReader
from src.DAOs.station.station_dao import StationDAO
from src.domain.station.stations import Stations


class StationService:
    def __init__(self, reader: AbstractFileReader[list[StationDAO]], logger):
        self.reader = reader
        self.logger = logger

    def get_stations(self) -> list[Stations]:
        self.logger.info("Reading stations from JSON")
        stations = self.reader.read_json()
        station_models = Stations(stations).sort_by_name()
        self.logger.info(f"Loaded {len(station_models)} naptan locations")
        return station_models
