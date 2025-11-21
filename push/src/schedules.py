import logging
import os

import requests
from pydantic import ValidationError

from src.models.models import (
    BestRouteSchedule,
    RailSchedule,
    SchedulesResponse,
    TubeLineStatusSchedule,
)

logger = logging.getLogger(__name__)


def get_schedules():
    api_url = os.environ.get("SERVER_URL", "http://localhost:8000")
    url = f"{api_url}/schedules"
    logger.debug(f"Fetching schedules from: {url}")

    try:
        resp = requests.get(url, timeout=30)
        logger.debug(f"Schedules API response status: {resp.status_code}")
        resp.raise_for_status()

        data = resp.json()
        schedules_response = SchedulesResponse(**data)
        logger.info(
            f"Successfully fetched {len(schedules_response.schedules)} schedules from API"
        )
        return schedules_response.schedules

    except ValidationError as e:
        logger.error(f"Invalid data format from {url}: {str(e)}")
        return []
    except Exception as e:
        logger.error(f"Error fetching from {url}: {str(e)}")
        return []


def get_schedules_with_topic() -> list[
    BestRouteSchedule | RailSchedule | TubeLineStatusSchedule
]:
    rail_topic = os.environ.get("RAIL_TOPIC", "")
    best_route_topic = os.environ.get("BEST_ROUTE_TOPIC", "")
    line_status_topic = os.environ.get("LINE_STATUS_TOPIC", "")

    logger.debug(
        f"Topic configuration - Rail: {rail_topic}, Best Route: {best_route_topic}, Line Status: {line_status_topic}"
    )

    schedules = get_schedules()
    schedule_models = []

    for sched in schedules:
        try:
            if sched["type"] == "rail_departure":
                schedule_models.append(RailSchedule(**sched, topic=rail_topic))
                from_name = sched.get("from_station_name", "unknown")
                to_name = sched.get("to_station_name", "unknown")
                logger.debug(
                    f"Created rail departure schedule: {from_name} -> {to_name}"
                )

            elif sched["type"] == "best_route":
                schedule_models.append(
                    BestRouteSchedule(**sched, topic=best_route_topic)
                )
                from_name = sched.get("from_name", "unknown")
                to_name = sched.get("to_name", "unknown")
                logger.debug(f"Created best route schedule: {from_name} -> {to_name}")

            elif sched["type"] == "tube_line_status":
                schedule_models.append(
                    TubeLineStatusSchedule(**sched, topic=line_status_topic)
                )
                day = sched.get("day_of_week", "unknown")
                time = sched.get("time", "unknown")
                logger.debug(f"Created tube line status schedule for {day} at {time}")
            else:
                logger.warning(
                    f"Unknown schedule type: {sched.get('type', 'missing type')}"
                )

        except Exception as e:
            logger.error(f"Failed to create schedule model for {sched}: {str(e)}")

    logger.info(
        f"Created {len(schedule_models)} schedule models from {len(schedules)} raw schedules"
    )
    return schedule_models
