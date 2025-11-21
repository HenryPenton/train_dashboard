from unittest.mock import patch

from src.jobs.jobs import job_best_route, job_rail_departures, job_tube_line_statuses


class DummySchedule:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)


def test_job_tube_line_statuses_exception():
    schedule = DummySchedule(topic="topic1")
    with (
        patch("src.jobs.jobs.fetch_tube_line_statuses", side_effect=Exception("fail")),
        patch("src.jobs.jobs.format_line_status_markdown"),
        patch("src.jobs.jobs.send_ntfy_notification"),
        patch("src.jobs.jobs.logging.getLogger"),
    ):
        job_tube_line_statuses(schedule)


def test_job_tube_line_statuses():
    schedule = DummySchedule(topic="topic1")
    with (
        patch(
            "src.jobs.jobs.fetch_tube_line_statuses",
            return_value=[],  # Simplified for test
        ) as fetch_mock,
        patch(
            "src.jobs.jobs.format_line_status_markdown", return_value="formatted"
        ) as format_mock,
        patch("src.jobs.jobs.send_ntfy_notification") as send_mock,
        patch("src.jobs.jobs.logging.getLogger"),
    ):
        job_tube_line_statuses(schedule)
        fetch_mock.assert_called_once_with()
        format_mock.assert_called_once_with([])
        send_mock.assert_called_once_with("topic1", "formatted")


def test_job_rail_departures_exception():
    schedule = DummySchedule(
        topic="topic2",
        from_station_code="AAA",
        to_station_code="BBB",
        from_station_name="Alpha",
        to_station_name="Beta",
    )
    with (
        patch("src.jobs.jobs.fetch_rail_departures", side_effect=Exception("fail")),
        patch("src.jobs.jobs.format_departures_markdown"),
        patch("src.jobs.jobs.send_ntfy_notification"),
        patch("src.jobs.jobs.logging.getLogger"),
    ):
        job_rail_departures(schedule)


def test_job_rail_departures():
    schedule = DummySchedule(
        topic="topic2",
        from_station_code="AAA",
        to_station_code="BBB",
        from_station_name="Alpha",
        to_station_name="Beta",
    )
    with (
        patch(
            "src.jobs.jobs.fetch_rail_departures",
            return_value=[],  # Simplified for test
        ) as fetch_mock,
        patch(
            "src.jobs.jobs.format_departures_markdown", return_value="formatted2"
        ) as format_mock,
        patch("src.jobs.jobs.send_ntfy_notification") as send_mock,
        patch("src.jobs.jobs.logging.getLogger"),
    ):
        job_rail_departures(schedule)
        fetch_mock.assert_called_once_with("AAA", "BBB")
        format_mock.assert_called_once_with([], "Alpha", "Beta")
        send_mock.assert_called_once_with("topic2", "formatted2")


def test_job_best_route_exception():
    schedule = DummySchedule(
        topic="topic3",
        from_code="X",
        to_code="Y",
        from_name="XName",
        to_name="YName",
    )
    with (
        patch("src.jobs.jobs.fetch_best_route", side_effect=Exception("fail")),
        patch("src.jobs.jobs.format_best_route_markdown"),
        patch("src.jobs.jobs.send_ntfy_notification"),
        patch("src.jobs.jobs.logging.getLogger"),
    ):
        job_best_route(schedule)


def test_job_best_route():
    schedule = DummySchedule(
        topic="topic3",
        from_code="X",
        to_code="Y",
        from_name="XName",
        to_name="YName",
    )
    with (
        patch(
            "src.jobs.jobs.fetch_best_route",
            return_value=None,  # Simplified for test
        ) as fetch_mock,
        patch(
            "src.jobs.jobs.format_best_route_markdown", return_value="formatted3"
        ) as format_mock,
        patch("src.jobs.jobs.send_ntfy_notification") as send_mock,
        patch("src.jobs.jobs.logging.getLogger"),
    ):
        job_best_route(schedule)
        fetch_mock.assert_called_once_with("X", "Y")
        format_mock.assert_called_once_with(None, "XName", "YName")
        send_mock.assert_called_once_with("topic3", "formatted3")
