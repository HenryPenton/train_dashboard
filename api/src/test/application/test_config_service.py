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
