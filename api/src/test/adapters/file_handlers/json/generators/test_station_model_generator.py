from src.adapters.file_handlers.json.generators.station_model_generator import (
    naptan_postprocess,
)
from src.DAOs.station.station_dao import StationDAO


def test_naptan_postprocess_with_list():
    data = [
        {
            "naptanID": "940GZZLUPAC",
            "commonName": "Paddington Underground Station",
        },
        {
            "naptanID": "940GZZLUKSX",
            "commonName": "King's Cross St. Pancras Underground Station",
        },
    ]

    result = naptan_postprocess(data)

    assert len(result) == 2
    assert all(isinstance(item, StationDAO) for item in result)
    assert result[0].naptanID == "940GZZLUPAC"
    assert result[1].naptanID == "940GZZLUKSX"


def test_naptan_postprocess_with_dict():
    data = {
        "paddington": {
            "naptanID": "940GZZLUPAC",
            "commonName": "Paddington Underground Station",
        },
        "kings_cross": {
            "naptanID": "940GZZLUKSX",
            "commonName": "King's Cross St. Pancras Underground Station",
        },
    }

    result = naptan_postprocess(data)

    assert len(result) == 2
    assert all(isinstance(item, StationDAO) for item in result)
    # Note: dict.values() order is not guaranteed, so we check both stations exist
    naptan_ids = [station.naptanID for station in result]
    assert "940GZZLUPAC" in naptan_ids
    assert "940GZZLUKSX" in naptan_ids


def test_naptan_postprocess_empty_list():
    data = []
    result = naptan_postprocess(data)
    assert result == []


def test_naptan_postprocess_empty_dict():
    data = {}
    result = naptan_postprocess(data)
    assert result == []
