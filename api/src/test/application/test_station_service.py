from pathlib import Path

from src.application.station_service import StationService
from src.DTOs.station.station_dto import StationDTO
from src.DAOs.station.station_dao import StationDAO


class DummyJSONFileReader:
    def __class_getitem__(cls, item):
        return cls

    def __init__(self, path, *args, **kwargs):
        self.path = path

    def read_json(self):
        return [
            StationDAO(**{"naptanID": "123", "commonName": "Alpha"}),
            StationDAO(**{"naptanID": "456", "commonName": "Beta"}),
        ]


class FailingJSONFileReader:
    def __class_getitem__(cls, item):
        return cls

    def __init__(self, path, *args, **kwargs):
        self.path = path

    def read_json(self):
        raise FileNotFoundError("Stations file not found")


def test_get_stations(monkeypatch):
    monkeypatch.setattr(
        "src.application.station_service.JSONFileReader", DummyJSONFileReader
    )
    service = StationService(Path("dummy"))
    stations = service.get_stations()

    assert stations == [
        StationDTO(naptanID="123", CommonName="Alpha"),
        StationDTO(naptanID="456", CommonName="Beta"),
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
