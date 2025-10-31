import os

from src.models.best_route import (
    BestRouteSchedule,
    RailSchedule,
    TubeLineStatusSchedule,
)

# schedules.py


def get_schedules():
    schedules = [
        {
            "type": "rail_departure",
            "from_station_code": "GLC",
            "to_station_code": "EUS",
            "from_station_name": "Glasgow Central",
            "day_of_week": "mon-wed,fri,sat",
            "to_station_name": "Euston",
            "time": "17:38",
        },
        {
            "type": "rail_departure",
            "from_station_code": "OXF",
            "to_station_code": "PAD",
            "from_station_name": "Oxford",
            "day_of_week": "fri",
            "to_station_name": "Paddington",
            "time": "11:35",
        },
        # Example invalid schedule for testing error handling
        {
            "type": "rail_departure",
            "from_station_code": "POL",
            "to_station_code": "MAN",
            "from_station_name": "Polsloe Bridge",
            "to_station_name": "Manchester Piccadilly",
            "day_of_week": "mon-wed,fri,sat",
            "time": "17:05",
        },
        # New best_route schedule example
        {
            "type": "best_route",
            "from_code": "910GABWDXR",
            "to_code": "940GZZCRWOD",
            "from_name": "Abbey Wood",
            "to_name": "Woodside Tram Stop",
            "day_of_week": "mon,fri",
            "time": "11:35",
        },
        {
            "type": "tube_line_status",
            "day_of_week": "mon,fri",
            "time": "11:35",
        },
    ]

    return schedules


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
