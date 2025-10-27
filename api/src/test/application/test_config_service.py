from src.application.config_service import ConfigService


class DummyJSONFileReader:
    def __init__(self, path):
        self.path = path

    def read_json(self):
        return {"foo": "bar"}


class FailingJSONFileReader:
    def __init__(self, path):
        self.path = path

    def read_json(self):
        raise FileNotFoundError("Config file not found")


def test_get_config(monkeypatch):
    # Patch JSONFileReader to use dummy
    monkeypatch.setattr(
        "src.application.config_service.JSONFileReader", DummyJSONFileReader
    )
    config = ConfigService.get_config()
    assert config == {
        "rail_departures": [],
        "tfl_best_routes": [],
        "show_tfl_lines": False,
        "refresh_timer": 60,
    }


def test_get_config_file_not_found(monkeypatch):
    monkeypatch.setattr(
        "src.application.config_service.JSONFileReader", FailingJSONFileReader
    )
    try:
        ConfigService.get_config()
        assert False, "Expected FileNotFoundError"
    except FileNotFoundError as e:
        assert str(e) == "Config file not found"


# Test for set_config
class DummyJSONFileWriter:
    def __init__(self, path):
        self.path = path
        self.written_data = None

    def write_json(self, data):
        self.written_data = data


def test_set_config(monkeypatch):
    dummy_writer = DummyJSONFileWriter("dummy_path.json")

    def dummy_writer_factory(path):
        return dummy_writer

    monkeypatch.setattr(
        "src.application.config_service.JSONFileWriter", dummy_writer_factory
    )
    new_config = {
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
    result = ConfigService.set_config(new_config)
    assert result is True
    # The dummy_writer should have received the processed config (extra_key removed)
    assert dummy_writer.written_data == {
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
