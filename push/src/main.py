import os
import time

from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

from src.jobs.jobs import job_best_route, job_rail_departure, job_tube_line_status
from src.schedules import get_schedules_with_topic

load_dotenv()

API_BASE = os.environ.get("SERVER_URL", "http://localhost:8000")


def schedule_jobs():
    scheduler = BackgroundScheduler()
    for sched in get_schedules_with_topic():
        if sched.type == "rail_departure":
            hour, minute = map(int, sched.time.split(":"))
            scheduler.add_job(
                job_rail_departure,
                "cron",
                hour=hour,
                minute=minute,
                day_of_week=sched.day_of_week,
                timezone="UTC",
                args=[sched],
                id=f"rail_{sched.from_station_code}_{sched.to_station_code}_{sched.time}",
            )
        elif sched.type == "best_route":
            hour, minute = map(int, sched.time.split(":"))
            scheduler.add_job(
                job_best_route,
                "cron",
                hour=hour,
                minute=minute,
                day_of_week=sched.day_of_week,
                timezone="UTC",
                args=[sched],
                id=f"best_route_{sched.from_code}_{sched.to_code}_{sched.time}",
            )
        elif sched.type == "tube_line_status":
            hour, minute = map(int, sched.time.split(":"))
            scheduler.add_job(
                job_tube_line_status,
                "cron",
                hour=hour,
                minute=minute,
                day_of_week=sched.day_of_week,
                timezone="UTC",
                args=[sched],
                id=f"tube_line_status_{sched.time}_{sched.day_of_week}",
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
