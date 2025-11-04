from src.DAOs.station.station_dao import StationDAO
from src.domain.station.stations import Stations, Station


def test_station_model():
    s = Station(naptanID="123", commonName="Alpha")
    assert s.naptanID == "123"
    assert s.commonName == "Alpha"


def test_stations_instantiation_and_sort():
    daos = [
        StationDAO(naptanID="2", commonName="Bravo"),
        StationDAO(naptanID="1", commonName="Alpha"),
        StationDAO(naptanID="3", commonName="charlie"),
    ]
    stations_model = Stations(daos)
    # Test that Stations creates Station models

    ordered_stations = stations_model.sort_by_name()
    assert [s.commonName for s in ordered_stations] == ["Alpha", "Bravo", "charlie"]
