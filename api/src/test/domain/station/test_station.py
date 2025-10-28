from src.domain.station.station import Station
from src.models.external_to_python.station.station_model import StationModel


def test_station_sort_by_name():
    stations = [
        StationModel(naptanID="2", commonName="Bravo"),
        StationModel(naptanID="1", commonName="Alpha"),
        StationModel(naptanID="3", commonName="charlie"),
    ]
    ordered = Station.sort_by_name(stations)
    assert [s.commonName for s in ordered] == ["Alpha", "Bravo", "charlie"]
