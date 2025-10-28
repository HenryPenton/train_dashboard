from src.schemas.bidirectional.config.config_schema import ConfigSchema
import pytest


def test_config_schema_valid():
    schema = ConfigSchema()
    data = {
        "tfl_best_routes": [
            {
                "origin": "A",
                "originNaPTANOrATCO": "X",
                "destination": "B",
                "destinationNaPTANOrATCO": "Y",
            }
        ],
        "rail_departures": [
            {
                "origin": "C",
                "originCode": "CX",
                "destination": "D",
                "destinationCode": "DX",
            }
        ],
        "show_tfl_lines": True,
    }
    result = schema.load(data)
    assert result["tfl_best_routes"][0]["origin"] == "A"
    assert result["rail_departures"][0]["originCode"] == "CX"
    assert result["show_tfl_lines"] is True


def test_config_schema_defaults():
    schema = ConfigSchema()
    data = {}
    result = schema.load(data)
    assert result["tfl_best_routes"] == []
    assert result["rail_departures"] == []
    assert result["show_tfl_lines"] is False


def test_config_schema_extra_keys_are_excluded():
    schema = ConfigSchema()
    data = {
        "tfl_best_routes": [],
        "rail_departures": [],
        "show_tfl_lines": False,
        "extra": 123,
    }
    result = schema.load(data)
    assert "extra" not in result


def test_config_schema_invalid_types():
    schema = ConfigSchema()
    data = {
        "tfl_best_routes": "notalist",
        "rail_departures": None,
        "show_tfl_lines": "yes",
    }
    with pytest.raises(Exception):
        schema.load(data)


def test_config_schema_refresh_timer_default():
    schema = ConfigSchema()
    data = {}
    result = schema.load(data)
    assert result["refresh_timer"] == 300


def test_config_schema_refresh_timer_custom():
    schema = ConfigSchema()
    data = {"refresh_timer": 120}
    result = schema.load(data)
    assert result["refresh_timer"] == 120
