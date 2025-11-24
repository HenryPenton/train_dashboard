from unittest.mock import MagicMock, patch

from src.fetchers.fetchers import (
    fetch_best_route,
    fetch_rail_departures,
    fetch_tube_line_statuses,
)


def test_fetch_rail_departures():
    with (
        patch("src.fetchers.fetchers.requests.get") as mock_get,
        patch("src.fetchers.fetchers.logging.getLogger"),
    ):
        mock_resp = MagicMock()
        mock_resp.json.return_value = [
            {
                "origin": "A",
                "destination": "B",
                "status": "On time",
                "platform": "1",
                "actual": "12:00",
                "delay": 0,
            }
        ]
        mock_resp.raise_for_status.return_value = None
        mock_get.return_value = mock_resp
        result = fetch_rail_departures("AAA", "BBB")
        mock_get.assert_called_once_with(
            "http://localhost:8000/rail/departures/AAA/to/BBB", timeout=30
        )
        mock_resp.raise_for_status.assert_called_once()
        assert len(result) == 1
        assert result[0].origin == "A"
        assert result[0].destination == "B"


def test_fetch_best_route():
    with (
        patch("src.fetchers.fetchers.requests.get") as mock_get,
        patch("src.fetchers.fetchers.logging.getLogger"),
    ):
        mock_resp = MagicMock()
        mock_resp.json.return_value = {
            "duration": 45,
            "arrival": "2025-11-03T15:30:00",
            "legs": [{"mode": "tube", "instruction": "Take the tube"}],
        }
        mock_resp.raise_for_status.return_value = None
        mock_get.return_value = mock_resp
        result = fetch_best_route("AAA", "BBB")
        mock_get.assert_called_once_with(
            "http://localhost:8000/tfl/best-route/AAA/BBB", timeout=30
        )
        mock_resp.raise_for_status.assert_called_once()
        assert result.duration == 45
        assert len(result.legs) == 1
        assert result.legs[0].mode == "tube"


def test_fetch_tube_line_statuses():
    with (
        patch("src.fetchers.fetchers.requests.get") as mock_get,
        patch("src.fetchers.fetchers.logging.getLogger"),
    ):
        mock_resp = MagicMock()
        mock_resp.json.return_value = [
            {"name": "Central", "statusList": ["Good Service"]}
        ]
        mock_resp.raise_for_status.return_value = None
        mock_get.return_value = mock_resp
        result = fetch_tube_line_statuses()
        mock_get.assert_called_once_with(
            "http://localhost:8000/tfl/line-status", timeout=30
        )
        mock_resp.raise_for_status.assert_called_once()
        assert len(result) == 1
        assert result[0].name == "Central"
        assert result[0].statusList == ["Good Service"]
