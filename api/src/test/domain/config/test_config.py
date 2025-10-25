from src.domain.config.config import Config


def test_process_config_with_show_tfl_lines_true():
    config = {"show_tfl_lines": True}
    processed = Config.process_config(config)
    assert processed["show_tfl_lines"] is True


def test_process_config_with_valid_rail_departures():
    config = {
        "rail_departures": [
            {
                "origin": "A",
                "originCode": "B",
                "destination": "C",
                "destinationCode": "D",
            },
            {
                "origin": "E",
                "originCode": "F",
                "destination": "G",
                "destinationCode": "H",
                "extra": "I",
            },
        ]
    }
    processed = Config.process_config(config)
    assert processed["rail_departures"] == [
        {"origin": "A", "originCode": "B", "destination": "C", "destinationCode": "D"},
        {"origin": "E", "originCode": "F", "destination": "G", "destinationCode": "H"},
    ]


def test_process_config_with_invalid_rail_departures():
    config = {
        "rail_departures": [
            {
                "origin": "A",
                "originCode": "B",
                "destination": "C",
            },  # missing destinationCode
            {
                "origin": "A",
                "originCode": "B",
                "destination": "C",
                "destinationCode": 123,
            },  # destinationCode not str
            "notadict",  # not a dict
        ]
    }
    processed = Config.process_config(config)
    assert processed["rail_departures"] == []


def test_process_config_with_valid_tfl_best_routes():
    config = {
        "tfl_best_routes": [
            {
                "origin": "A",
                "originNaPTANOrATCO": "B",
                "destination": "C",
                "destinationNaPTANOrATCO": "D",
            },
            {
                "origin": "E",
                "originNaPTANOrATCO": "F",
                "destination": "G",
                "destinationNaPTANOrATCO": "H",
                "extra": "I",
            },
        ]
    }
    processed = Config.process_config(config)
    assert processed["tfl_best_routes"] == [
        {
            "origin": "A",
            "originNaPTANOrATCO": "B",
            "destination": "C",
            "destinationNaPTANOrATCO": "D",
        },
        {
            "origin": "E",
            "originNaPTANOrATCO": "F",
            "destination": "G",
            "destinationNaPTANOrATCO": "H",
        },
    ]


def test_process_config_with_invalid_tfl_best_routes():
    config = {
        "tfl_best_routes": [
            {
                "origin": "A",
                "originNaPTANOrATCO": "B",
                "destination": "C",
            },  # missing destinationNaPTANOrATCO
            {
                "origin": "A",
                "originNaPTANOrATCO": "B",
                "destination": "C",
                "destinationNaPTANOrATCO": 123,
            },  # destinationNaPTANOrATCO not str
            "notadict",  # not a dict
        ]
    }
    processed = Config.process_config(config)
    assert processed["tfl_best_routes"] == []


def test_process_config_with_missing_arrays():
    config = {}
    processed = Config.process_config(config)
    assert set(processed.keys()) == {
        "tfl_best_routes",
        "rail_departures",
        "show_tfl_lines",
    }
    assert processed["tfl_best_routes"] == []
    assert processed["rail_departures"] == []
    assert processed["show_tfl_lines"] is False


def test_process_config_with_non_list_arrays():
    config = {"tfl_best_routes": "notalist", "rail_departures": 123}
    processed = Config.process_config(config)
    assert set(processed.keys()) == {
        "tfl_best_routes",
        "rail_departures",
        "show_tfl_lines",
    }
    assert processed["tfl_best_routes"] == []
    assert processed["rail_departures"] == []
    assert processed["show_tfl_lines"] is False


def test_process_config_with_extra_keys():
    config = {"foo": "bar"}
    processed = Config.process_config(config)
    assert set(processed.keys()) == {
        "tfl_best_routes",
        "rail_departures",
        "show_tfl_lines",
    }
    assert "tfl_best_routes" in processed
    assert "rail_departures" in processed
    assert "show_tfl_lines" in processed
    assert processed["show_tfl_lines"] is False


def test_process_config_with_missing_tfl_lines():
    config = {"foo": "bar"}
    processed = Config.process_config(config)
    assert processed["show_tfl_lines"] is False
