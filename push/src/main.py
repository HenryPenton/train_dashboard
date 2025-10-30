import logging
import time

import requests
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
from python_ntfy import NtfyClient

from src.schedules import get_schedules_with_topic

load_dotenv()

API_BASE = "http://train_dashboard_api:8000"  # Replace with your API server


def fetch_rail_departure(from_station, to_station):
    url = f"{API_BASE}/rail/departures/{from_station}/to/{to_station}"
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


def format_departures_markdown(departures, from_station_name, to_station_name):
    if not departures:
        return "No departures found."

    lines = [
        f"# 🚆 Upcoming Departures from {from_station_name} to {to_station_name}",
        "",
    ]
    for dep in departures[:10]:
        formatted_status = ""
        delay_time = dep.get("delay", 0)
        status = dep.get("status", "").lower()
        minsmin = "mins" if delay_time != 1 else "min"
        if status in ["late", "delayed"]:
            emoji = "🔴"
            formatted_status = f"**{dep.get('status', '')} ({delay_time} {minsmin})**"
        else:
            formatted_status = f"**{dep.get('status', '')}**"
            emoji = "🟢"

        lines.append(
            f"{emoji} **{dep.get('origin', '')}** -> **{dep.get('destination', '')}** is {formatted_status} "
            f"and departs from platform **{dep.get('platform', '')}** at **{dep.get('actual', '')}**\n"
        )
    return "\n".join(lines)


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
                timezone="UTC",
                args=[sched],
                id=f"rail_{sched['from_station_code']}_{sched['to_station_code']}_{sched['time']}",
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
