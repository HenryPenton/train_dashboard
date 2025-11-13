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


def test_station_equality_equal_stations():
    station1 = Station(naptanID="123", commonName="Alpha")
    station2 = Station(naptanID="123", commonName="Alpha")
    assert station1 == station2


def test_station_equality_different_naptan_id():
    station1 = Station(naptanID="123", commonName="Alpha")
    station2 = Station(naptanID="456", commonName="Alpha")
    assert station1 != station2


def test_station_equality_different_common_name():
    station1 = Station(naptanID="123", commonName="Alpha")
    station2 = Station(naptanID="123", commonName="Beta")
    assert station1 != station2


def test_station_equality_with_string():
    station = Station(naptanID="123", commonName="Alpha")
    assert station != "not a station"


def test_station_equality_with_none():
    station = Station(naptanID="123", commonName="Alpha")
    assert station is not None


def test_station_equality_with_number():
    station = Station(naptanID="123", commonName="Alpha")
    assert station != 123
