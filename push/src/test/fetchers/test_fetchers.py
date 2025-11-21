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
        mock_resp.json.return_value = {"departures": [1, 2, 3]}
        mock_resp.raise_for_status.return_value = None
        mock_get.return_value = mock_resp
        result = fetch_rail_departures("AAA", "BBB")
        mock_get.assert_called_once_with(
            "http://localhost:8000/rail/departures/AAA/to/BBB", timeout=30
        )
        mock_resp.raise_for_status.assert_called_once()
        assert result == {"departures": [1, 2, 3]}


def test_fetch_best_route():
    with (
        patch("src.fetchers.fetchers.requests.get") as mock_get,
        patch("src.fetchers.fetchers.logging.getLogger"),
    ):
        mock_resp = MagicMock()
        mock_resp.json.return_value = {"route": "best"}
        mock_resp.raise_for_status.return_value = None
        mock_get.return_value = mock_resp
        result = fetch_best_route("AAA", "BBB")
        mock_get.assert_called_once_with(
            "http://localhost:8000/tfl/best-route/AAA/BBB", timeout=30
        )
        mock_resp.raise_for_status.assert_called_once()
        assert result == {"route": "best"}


def test_fetch_tube_line_statuses():
    with (
        patch("src.fetchers.fetchers.requests.get") as mock_get,
        patch("src.fetchers.fetchers.logging.getLogger"),
    ):
        mock_resp = MagicMock()
        mock_resp.json.return_value = {"status": "ok"}
        mock_resp.raise_for_status.return_value = None
        mock_get.return_value = mock_resp
        result = fetch_tube_line_statuses()
        mock_get.assert_called_once_with(
            "http://localhost:8000/tfl/line-status", timeout=30
        )
        mock_resp.raise_for_status.assert_called_once()
        assert result == {"status": "ok"}
