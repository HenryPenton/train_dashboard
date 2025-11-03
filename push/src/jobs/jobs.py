import logging

from src.fetchers.fetchers import (
    fetch_best_route,
    fetch_rail_departures,
    fetch_tube_line_statuses,
)
from src.formatters.best_route import format_best_route_markdown
from src.formatters.departures import format_departures_markdown
from src.formatters.line_status import format_line_status_markdown
from src.ntfy.ntfy import send_ntfy_notification


def job_tube_line_statuses(schedule):
    try:
        info = fetch_tube_line_statuses()
        msg = format_line_status_markdown(info)
        send_ntfy_notification(schedule.topic, msg)
    except Exception:
        logging.exception("Error fetching tube line status information")


def job_rail_departures(schedule):
    from_station = schedule.from_station_code
    to_station = schedule.to_station_code
    from_station_name = schedule.from_station_name
    to_station_name = schedule.to_station_name

    try:
        info = fetch_rail_departures(from_station, to_station)
        msg = format_departures_markdown(info, from_station_name, to_station_name)
        send_ntfy_notification(schedule.topic, msg)
    except Exception:
        logging.exception(
            f"Error fetching rail departure information between {from_station_name} and {to_station_name}"
        )


def job_best_route(schedule):
    from_code = schedule.from_code
    to_code = schedule.to_code
    from_name = schedule.from_name
    to_name = schedule.to_name

    try:
        info = fetch_best_route(from_code, to_code)
        msg = format_best_route_markdown(info, from_name, to_name)
        send_ntfy_notification(schedule.topic, msg)
    except Exception:
        logging.exception(
            f"Error fetching best route information between {from_name} and {to_name}"
        )
