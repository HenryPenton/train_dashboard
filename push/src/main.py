import logging
import os
import time

import requests
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
from python_ntfy import NtfyClient

from src.schedules import get_schedules_with_topic
from src.formatters.best_route import format_best_route_markdown
from src.formatters.departures import format_departures_markdown

load_dotenv()

API_BASE = os.environ.get("SERVER_URL", "http://localhost:8000")


def fetch_rail_departure(from_station, to_station):
    url = f"{API_BASE}/rail/departures/{from_station}/to/{to_station}"
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.json()


def fetch_best_route(from_station, to_station):
    url = f"{API_BASE}/tfl/best-route/{from_station}/{to_station}"
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.json()


def send_ntfy_notification(topic, message):
    print(f"Sending notification to topic {topic}: {message}")
    client = NtfyClient(topic=topic)
    client.send(message, format_as_markdown=True)


def job_rail_departure(schedule):
    from_station = schedule["from_station_code"]
    to_station = schedule["to_station_code"]
    from_station_name = schedule["from_station_name"]
    to_station_name = schedule["to_station_name"]

    try:
        info = fetch_rail_departure(from_station, to_station)
        msg = format_departures_markdown(info, from_station_name, to_station_name)
        send_ntfy_notification(schedule["topic"], msg)
    except Exception:
        logging.exception(
            f"Error fetching rail departure information between {from_station_name} and {to_station_name}"
        )


def job_best_route(schedule):
    from_code = schedule["from_code"]
    to_code = schedule["to_code"]
    from_name = schedule["from_name"]
    to_name = schedule["to_name"]

    try:
        info = fetch_best_route(from_code, to_code)
        msg = format_best_route_markdown(info, from_name, to_name)
        send_ntfy_notification(schedule["topic"], msg)
    except Exception:
        logging.exception(
            f"Error fetching best route information between {from_name} and {to_name}"
        )


def schedule_jobs():
    scheduler = BackgroundScheduler()
    for sched in get_schedules_with_topic():
        if sched["type"] == "rail_departure":
            hour, minute = map(int, sched["time"].split(":"))
            scheduler.add_job(
                job_rail_departure,
                "cron",
                hour=hour,
                minute=minute,
                day_of_week=sched["day_of_week"],
                timezone="UTC",
                args=[sched],
                id=f"rail_{sched['from_station_code']}_{sched['to_station_code']}_{sched['time']}",
            )
        elif sched["type"] == "best_route":
            hour, minute = map(int, sched["time"].split(":"))
            scheduler.add_job(
                job_best_route,
                "cron",
                hour=hour,
                minute=minute,
                day_of_week=sched["day_of_week"],
                timezone="UTC",
                args=[sched],
                id=f"best_route_{sched['from_code']}_{sched['to_code']}_{sched['time']}",
            )
    scheduler.start()
    return scheduler


def main():
    scheduler = schedule_jobs()
    print("Push notification server started. Waiting for scheduled jobs...")
    try:
        while True:
            time.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        print("Shutting down push server.")


if __name__ == "__main__":
    main()
