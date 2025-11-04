import pytest
from src.application.schedule_service import ScheduleService


# In-memory mock file writer/reader
class MockFileWriter:
    def __init__(self, path, store):
        self.path = path
        self.store = store

    def write_json(self, data: dict):
        self.store["data"] = data


class MockFileReader:
    def __init__(self, path, store):
        self.path = path
        self.store = store

    def read_json(self):
        if "data" not in self.store:
            raise FileNotFoundError("File not found")
        return self.store["data"]


# Example valid and invalid payloads
valid_schedules = {
    "schedules": [
        {
            "type": "rail_departure",
            "from_station_code": "GLC",
            "to_station_code": "EUS",
            "from_station_name": "Glasgow Central",
            "to_station_name": "Euston",
            "day_of_week": "mon",
            "time": "17:38",
        }
    ]
}

invalid_schedules = {
    "schedules": [
        {
            "type": "rail_departure",
            # missing required fields
            "from_station_code": "GLC",
        }
    ]
}


class DummyPath:
    def __init__(self, exists=True):
        self._exists = exists

    def exists(self):
        return self._exists


def test_set_schedules_happy():
    store = {}
    dummy_path = DummyPath(exists=True)
    reader = MockFileReader(dummy_path, store)
    writer = MockFileWriter(dummy_path, store)
    service = ScheduleService(reader=reader, writer=writer, schedules_path=dummy_path)
    # Set schedules
    assert service.set_schedules(valid_schedules) is True


def test_get_schedules_happy():
    store = {"data": valid_schedules}
    dummy_path = DummyPath(exists=True)
    reader = MockFileReader(dummy_path, store)
    writer = MockFileWriter(dummy_path, store)

    service = ScheduleService(reader=reader, writer=writer, schedules_path=dummy_path)
    # Get schedules
    result = service.get_schedules()
    assert result["schedules"][0]["from_station_code"] == "GLC"
    assert result["schedules"][0]["to_station_code"] == "EUS"


def test_set_schedules_unhappy():
    store = {}
    dummy_path = DummyPath(exists=True)
    reader = MockFileReader(dummy_path, store)
    writer = MockFileWriter(dummy_path, store)
    service = ScheduleService(reader=reader, writer=writer, schedules_path=dummy_path)
    # Should raise error due to missing required fields
    with pytest.raises(Exception):
        service.set_schedules(invalid_schedules)


def test_get_schedules_creates_file():
    store = {}
    dummy_path = DummyPath(exists=False)
    reader = MockFileReader(dummy_path, store)
    writer = MockFileWriter(dummy_path, store)
    service = ScheduleService(reader=reader, writer=writer, schedules_path=dummy_path)
    # Should create file and return default
    result = service.get_schedules()
    assert "schedules" in result
