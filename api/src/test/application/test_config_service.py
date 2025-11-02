import shutil
import tempfile
from pathlib import Path

import pytest
from src.application.config_service import ConfigService


# Use a temp file for isolation
def temp_config_path(monkeypatch):
    tmp_dir = tempfile.mkdtemp()
    tmp_path = Path(tmp_dir) / "config.json"
    monkeypatch.setattr("src.application.config_service.CONFIG_PATH", tmp_path)
    yield tmp_path
    shutil.rmtree(tmp_dir)


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


def test_set_and_get_config_happy(monkeypatch):
    for _ in temp_config_path(monkeypatch):
        # Set config
        assert ConfigService.set_config(valid_config) is True
        # Get config
        result = ConfigService.get_config()
        assert result == {
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


def test_set_config_unhappy(monkeypatch):
    for _ in temp_config_path(monkeypatch):
        # Should raise error due to missing required fields
        with pytest.raises(Exception):
            ConfigService.set_config(invalid_config)


def test_get_config_creates_file(monkeypatch):
    for tmp_path in temp_config_path(monkeypatch):
        # File should not exist
        if tmp_path.exists():
            tmp_path.unlink()
        # Should create file and return default
        result = ConfigService.get_config()
        assert "rail_departures" in result
        assert "tfl_best_routes" in result
        assert tmp_path.exists()
