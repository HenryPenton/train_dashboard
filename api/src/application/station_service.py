from pathlib import Path
from typing import List

from src.adapters.file_handlers.json.generators.station_model_generator import (
    naptan_postprocess,
)
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.DAOs.station.station_dao import StationDAO
from src.domain.station.stations import Stations
from src.DTOs.station.station_dto import StationDTO


class StationService:
    def __init__(self, stations_path: Path):
        self.reader = JSONFileReader[List[StationDAO]](
            stations_path, postprocess_fn=naptan_postprocess
        )

    def get_stations(self) -> list[StationDTO]:
        stations = self.reader.read_json()
        stations = Stations.sort_by_name(stations)
        return [
            StationDTO(naptanID=station.naptanID, CommonName=station.commonName)
            for station in stations
        ]
