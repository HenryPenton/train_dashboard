from pathlib import Path
from typing import List

from src.adapters.file_handlers.json.generators.station_model_generator import (
    naptan_postprocess,
)
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.domain.station.station import Station
from src.DTOs.station_dto import StationDTO
from src.models.external_to_python.station.station_model import StationModel


class StationService:
    def __init__(self, stations_path: Path):
        self.reader = JSONFileReader[List[StationModel]](
            stations_path, postprocess_fn=naptan_postprocess
        )

    def get_stations(self) -> list[StationDTO]:
        stations = self.reader.read_json()  # stations is List[StationModel]
        stations = Station.sort_by_name(stations)
        return [
            StationDTO(naptanID=station.naptanID, CommonName=station.commonName)
            for station in stations
        ]
