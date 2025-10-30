import os
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
            "day_of_week": "thu",
            "to_station_name": "Paddington",
            "time": "17:38",
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
    ]
    return schedules


def get_schedules_with_topic():
    rail_topic = os.environ.get("RAIL_TOPIC", "")
    schedules = get_schedules()
    for sched in schedules:
        if sched["type"] == "rail_departure":
            sched["topic"] = rail_topic
    return schedules
