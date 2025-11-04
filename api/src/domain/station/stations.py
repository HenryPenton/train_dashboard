from src.DAOs.station.station_dao import StationDAO


class Station:
    def __init__(self, naptanID: str, commonName: str):
        self.naptanID = naptanID
        self.commonName = commonName

    def __eq__(self, other):
        if not isinstance(other, Station):
            return False
        return self.naptanID == other.naptanID and self.commonName == other.commonName


class Stations:
    def __init__(self, daos: list[StationDAO]):
        self.stations = [Station(dao.naptanID, dao.commonName) for dao in daos]

    def sort_by_name(self) -> list[Station]:
        return sorted(self.stations, key=lambda x: x.commonName.lower())
