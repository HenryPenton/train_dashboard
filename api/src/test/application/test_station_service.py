from src.application.station_service import StationService
from pathlib import Path


class DummyJSONFileReader:
    def __init__(self, path):
        self.path = path

    def read_json(self):
        return [
            {"naptanID": "123", "commonName": "Alpha"},
            {"naptanID": "456", "commonName": "Beta"},
        ]


class FailingJSONFileReader:
    def __init__(self, path):
        self.path = path

    def read_json(self):
        raise FileNotFoundError("Stations file not found")


def test_get_stations(monkeypatch):
    monkeypatch.setattr(
        "src.application.station_service.JSONFileReader", DummyJSONFileReader
    )
    service = StationService(Path("dummy"))
    stations = service.get_stations()
    from src.domain.station.station import Station

    assert stations == [
        Station(naptanID="123", CommonName="Alpha"),
        Station(naptanID="456", CommonName="Beta"),
    ]


def test_get_stations_file_not_found(monkeypatch):
    monkeypatch.setattr(
        "src.application.station_service.JSONFileReader", FailingJSONFileReader
    )
    service = StationService(Path("dummy"))
    try:
        service.get_stations()
        assert False, "Expected FileNotFoundError"
    except FileNotFoundError as e:
        assert str(e) == "Stations file not found"
