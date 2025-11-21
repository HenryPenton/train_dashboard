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
    logger = logging.getLogger(__name__)
    logger.info(f"Starting tube line status job for topic: {schedule.topic}")

    try:
        info = fetch_tube_line_statuses()
        logger.debug(
            f"Fetched {len(info) if isinstance(info, list) else 'unknown count'} line status updates"
        )

        msg = format_line_status_markdown(info)
        send_ntfy_notification(schedule.topic, msg)
        logger.info(
            f"Successfully sent tube line status notification to {schedule.topic}"
        )

    except Exception as e:
        logger.error(
            f"Error in tube line status job for topic {schedule.topic}: {str(e)}"
        )


def job_rail_departures(schedule):
    logger = logging.getLogger(__name__)
    from_station = schedule.from_station_code
    to_station = schedule.to_station_code
    from_station_name = schedule.from_station_name
    to_station_name = schedule.to_station_name

    logger.info(f"Starting rail departures: {from_station_name} -> {to_station_name}")

    try:
        info = fetch_rail_departures(from_station, to_station)
        logger.debug(
            f"Fetched {len(info) if isinstance(info, list) else 'unknown count'} departures"
        )

        msg = format_departures_markdown(info, from_station_name, to_station_name)
        send_ntfy_notification(schedule.topic, msg)
        logger.info(
            f"Successfully sent rail departures notification for {from_station_name} → {to_station_name}"
        )

    except Exception as e:
        logger.error(
            f"Error in rail departures job {from_station_name} → {to_station_name}: {str(e)}"
        )


def job_best_route(schedule):
    logger = logging.getLogger(__name__)
    from_code = schedule.from_code
    to_code = schedule.to_code
    from_name = schedule.from_name
    to_name = schedule.to_name

    logger.info(
        f"Starting best route job: {from_name} ({from_code}) → {to_name} ({to_code})"
    )

    try:
        info = fetch_best_route(from_code, to_code)
        logger.debug(f"Fetched route info: {type(info)}")

        msg = format_best_route_markdown(info, from_name, to_name)
        send_ntfy_notification(schedule.topic, msg)
        logger.info(
            f"Successfully sent best route notification for {from_name} → {to_name}"
        )

    except Exception as e:
        logger.error(f"Error in best route job {from_name} → {to_name}: {str(e)}")
