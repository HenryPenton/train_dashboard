import pytest
from src.application.config_service import ConfigService
from src.DTOs.config.config_dto import ConfigDTO
from src.test.utils.dummy_logger import DummyLogger


class MockPath:
    def __init__(self, exists=True):
        self._exists = exists
        self.parent = MockParentPath()

    def exists(self):
        return self._exists


class MockParentPath:
    def mkdir(self, parents=True, exist_ok=True):
        # Mock implementation - just return without doing anything
        pass


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
            "importance": 1,
            "destinationNaPTANOrATCO": "naptanB",
        }
    ],
    "rail_departures": [
        {
            "origin": "C",
            "originCode": "codeC",
            "destination": "D",
            "destinationCode": "codeD",
            "importance": 1,
        }
    ],
    "tube_departures": [
        {
            "stationName": "Paddington",
            "stationId": "940GZZLUPAD",
        }
    ],
    "tfl_line_status": {
        "enabled": True,
        "importance": 1,
    },
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
                "col_2_position": 1,
                "col_3_position": 1,
                "importance": 1,
                "destinationNaPTANOrATCO": "naptanB",
            }
        ],
        "rail_departures": [
            {
                "origin": "C",
                "originCode": "codeC",
                "col_2_position": 1,
                "col_3_position": 1,
                "importance": 1,
                "destination": "D",
                "destinationCode": "codeD",
            }
        ],
        "tube_departures": [
            {
                "stationName": "Paddington",
                "stationId": "940GZZLUPAD",
                "col_2_position": 1,
                "col_3_position": 1,
                "importance": 1,
            }
        ],
        "tfl_line_status": {
            "enabled": True,
            "col_2_position": 1,
            "col_3_position": 1,
            "importance": 1,
        },
        "refresh_timer": 65,
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
    assert "tube_departures" in result
    assert "tfl_line_status" in result
