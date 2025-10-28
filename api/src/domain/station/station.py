from src.models.external_to_python.station.station_model import StationModel


class Station:
    @classmethod
    def sort_by_name(cls, stations: list[StationModel]) -> list[StationModel]:
        return sorted(stations, key=lambda x: x.commonName.lower())
