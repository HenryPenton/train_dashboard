from src.DAOs.station.station_dao import StationDAO


class Stations:
    @classmethod
    def sort_by_name(cls, stations: list[StationDAO]) -> list[StationDAO]:
        return sorted(stations, key=lambda x: x.commonName.lower())
