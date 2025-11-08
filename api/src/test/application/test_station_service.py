from src.application.station_service import StationService
from src.DAOs.station.station_dao import StationDAO
from src.domain.station.stations import Station
from src.test.utils.dummy_logger import DummyLogger


class DummyJSONFileReader:
    def __class_getitem__(cls, item):
        return cls

    def __init__(self, path, *args, **kwargs):
        self.path = path

    def read_json(self):
        return [
            StationDAO(naptanID="123", commonName="Alpha"),
            StationDAO(naptanID="456", commonName="Beta"),
        ]


class FailingJSONFileReader:
    def __class_getitem__(cls, item):
        return cls

    def __init__(self, path, *args, **kwargs):
        self.path = path

    def read_json(self):
        raise FileNotFoundError("Stations file not found")


def test_get_stations():
    reader = DummyJSONFileReader(None)
    logger = DummyLogger()
    service = StationService(reader, logger)
    stations = service.get_stations()
    assert stations == [
        Station(naptanID="123", commonName="Alpha"),
        Station(naptanID="456", commonName="Beta"),
    ]


def test_get_stations_file_not_found():
    reader = FailingJSONFileReader(None)
    logger = DummyLogger()
    service = StationService(reader, logger)
    try:
        service.get_stations()
        assert False, "Expected FileNotFoundError"
    except FileNotFoundError as e:
        assert str(e) == "Stations file not found"
