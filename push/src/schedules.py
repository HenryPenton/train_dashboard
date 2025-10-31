import os

import requests

from src.models.best_route import (
    BestRouteSchedule,
    RailSchedule,
    TubeLineStatusSchedule,
)

# schedules.py


def get_schedules():
    api_url = os.environ.get("SERVER_URL", "http://localhost:8000")
    try:
        resp = requests.get(f"{api_url}/schedules")
        resp.raise_for_status()
        data = resp.json()
        # Expecting {"schedules": [...]}
        return data.get("schedules", [])
    except Exception as e:
        print(f"Error fetching schedules from API: {e}")
        return []


def get_schedules_with_topic() -> list[
    BestRouteSchedule | RailSchedule | TubeLineStatusSchedule
]:
    rail_topic = os.environ.get("RAIL_TOPIC", "")
    best_route_topic = os.environ.get("BEST_ROUTE_TOPIC", "")
    line_status_topic = os.environ.get("LINE_STATUS_TOPIC", "")
    schedules = get_schedules()
    schedule_models = []
    for sched in schedules:
        if sched["type"] == "rail_departure":
            schedule_models.append(RailSchedule(**sched, topic=rail_topic))

        elif sched["type"] == "best_route":
            schedule_models.append(BestRouteSchedule(**sched, topic=best_route_topic))

        elif sched["type"] == "tube_line_status":
            schedule_models.append(
                TubeLineStatusSchedule(**sched, topic=line_status_topic)
            )
    return schedule_models
