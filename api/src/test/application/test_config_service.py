import pytest
from src.application.config_service import ConfigService
from src.DTOs.config.config_dto import ConfigDTO
from src.test.utils.dummy_logger import DummyLogger


class MockPath:
    def __init__(self, exists=True):
        self._exists = exists

    def exists(self):
        return self._exists


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


# Example valid and invalid config payloads
valid_config = {
    "tfl_best_routes": [
        {
            "origin": "A",
            "originNaPTANOrATCO": "naptanA",
            "destination": "B",
            "destinationNaPTANOrATCO": "naptanB",
        }
    ],
    "rail_departures": [
        {
            "origin": "C",
            "originCode": "codeC",
            "destination": "D",
            "destinationCode": "codeD",
        }
    ],
    "show_tfl_lines": True,
    "refresh_timer": 65,
    "extra_key": "should be removed",
}

invalid_config = {"rail_departures": [{"origin": "C"}]}  # missing required fields


def test_set_config_happy():
    store = {}
    mock_path = MockPath(exists=True)
    reader = MockFileReader(mock_path, store)
    writer = MockFileWriter(mock_path, store)
    service = ConfigService(
        reader=reader,
        writer=writer,
        config_path=mock_path,
        logger=DummyLogger(),
    )
    # Set config
    assert service.set_config(ConfigDTO(**valid_config)) is True


def test_get_config_happy():
    # Assume config has already been set
    store = {"data": valid_config}
    mock_path = MockPath(exists=True)
    reader = MockFileReader(mock_path, store)
    writer = MockFileWriter(mock_path, store)
    service = ConfigService(
        reader=reader,
        writer=writer,
        config_path=mock_path,
        logger=DummyLogger(),
    )
    reader._data = valid_config
    result = service.get_config().model_dump()
    expected_result = {
        "tfl_best_routes": [
            {
                "origin": "A",
                "originNaPTANOrATCO": "naptanA",
                "destination": "B",
                "destinationNaPTANOrATCO": "naptanB",
            }
        ],
        "rail_departures": [
            {
                "origin": "C",
                "originCode": "codeC",
                "destination": "D",
                "destinationCode": "codeD",
            }
        ],
        "refresh_timer": 65,
        "show_tfl_lines": True,
    }
    assert result == expected_result


def test_set_config_unhappy():
    store = {}
    mock_path = MockPath(exists=True)
    reader = MockFileReader(mock_path, store)
    writer = MockFileWriter(mock_path, store)
    service = ConfigService(
        reader=reader,
        writer=writer,
        config_path=mock_path,
        logger=DummyLogger(),
    )
    # Should raise error due to missing required fields
    with pytest.raises(Exception):
        service.set_config(invalid_config)


def test_get_config_creates_file():
    store = {}
    mock_path = MockPath(exists=False)
    reader = MockFileReader(mock_path, store)
    writer = MockFileWriter(mock_path, store)
    service = ConfigService(
        reader=reader,
        writer=writer,
        config_path=mock_path,
        logger=DummyLogger(),
    )
    # Should create file and return default
    result = service.get_config().model_dump()
    assert "rail_departures" in result
    assert "tfl_best_routes" in result
