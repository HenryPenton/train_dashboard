import os
import time

from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

from src.jobs.jobs import job_best_route, job_rail_departures, job_tube_line_statuses
from src.schedules import get_schedules_with_topic

load_dotenv()


timezone = os.environ.get("TZ", "UTC")


def schedule_jobs(schedules=[]):
    scheduler = BackgroundScheduler()
    for sched in schedules:
        if sched.type == "rail_departure":
            hour, minute = map(int, sched.time.split(":"))
            scheduler.add_job(
                job_rail_departures,
                "cron",
                hour=hour,
                minute=minute,
                day_of_week=sched.day_of_week,
                timezone=timezone,
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
                timezone=timezone,
                args=[sched],
                id=f"best_route_{sched.from_code}_{sched.to_code}_{sched.time}",
            )
        elif sched.type == "tube_line_status":
            hour, minute = map(int, sched.time.split(":"))
            scheduler.add_job(
                job_tube_line_statuses,
                "cron",
                hour=hour,
                minute=minute,
                day_of_week=sched.day_of_week,
                timezone=timezone,
                args=[sched],
                id=f"tube_line_status_{sched.time}_{sched.day_of_week}",
            )
    scheduler.start()
    return scheduler


def main():
    scheduler = schedule_jobs(get_schedules_with_topic())
    sleep_time = os.environ.get("SCHEDULE_REFRESH_INTERVAL", 60)
    sleep_time = int(sleep_time)
    print("Push notification server started. Waiting for scheduled jobs...")
    print(f"Fetching updated schedules every {sleep_time} seconds...")
    print(f"Scheduling jobs with timezone: {timezone}")

    try:
        while True:
            time.sleep(sleep_time)

            # Make sure new schedules are picked up before shutting down old scheduler
            # Avoids the possibility of no scheduled jobs between shutdown and restart
            new_scheduler = schedule_jobs(get_schedules_with_topic())
            old_scheduler = scheduler
            scheduler = new_scheduler
            old_scheduler.shutdown()

    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        print("Shutting down push server.")


if __name__ == "__main__":
    main()
