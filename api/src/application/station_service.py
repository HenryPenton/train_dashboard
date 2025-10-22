from pathlib import Path
from typing import List
from src.adapters.file_handlers.json_file_read import JSONFileReader
from src.domain.station.station import Station


class StationService:
    def __init__(self, stations_path: Path):
        self.reader = JSONFileReader(stations_path)

    def get_stations(self) -> List[Station]:
        data = self.reader.read_json()
        stations = [
            Station(ATCOCode=s["ATCOCode"], CommonName=s["CommonName"])
            for s in data
            if "ATCOCode" in s and "CommonName" in s
        ]
        stations.sort(key=lambda x: x.CommonName.lower())
        return stations
