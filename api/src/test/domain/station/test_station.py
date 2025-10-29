from src.DAOs.station.station_dao import StationDAO
from src.domain.station.stations import Stations


def test_station_sort_by_name():
    stations = [
        StationDAO(naptanID="2", commonName="Bravo"),
        StationDAO(naptanID="1", commonName="Alpha"),
        StationDAO(naptanID="3", commonName="charlie"),
    ]
    ordered = Stations.sort_by_name(stations)
    assert [s.commonName for s in ordered] == ["Alpha", "Bravo", "charlie"]
