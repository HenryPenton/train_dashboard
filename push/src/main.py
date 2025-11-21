import logging
import os
import time

from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

from src.jobs.jobs import job_best_route, job_rail_departures, job_tube_line_statuses
from src.logging_config import setup_logging
from src.schedules import get_schedules_with_topic

load_dotenv()

# Setup logging and get configuration info
log_level_str, max_log_size, backup_count = setup_logging()
logger = logging.getLogger(__name__)

timezone = os.environ.get("TZ", "UTC")


def schedule_jobs(schedules=[]):
    logger.info(f"Scheduling {len(schedules)} jobs")
    scheduler = BackgroundScheduler()

    for sched in schedules:
        try:
            if sched.type == "rail_departure":
                hour, minute = map(int, sched.time.split(":"))
                job_id = f"rail_{sched.from_station_code}_{sched.to_station_code}_{sched.time}"
                scheduler.add_job(
                    job_rail_departures,
                    "cron",
                    hour=hour,
                    minute=minute,
                    day_of_week=sched.day_of_week,
                    timezone=timezone,
                    args=[sched],
                    id=job_id,
                )
                logger.debug(
                    f"Scheduled rail departure job: {job_id} at {sched.time} on {sched.day_of_week}"
                )
            elif sched.type == "best_route":
                hour, minute = map(int, sched.time.split(":"))
                job_id = f"best_route_{sched.from_code}_{sched.to_code}_{sched.time}"
                scheduler.add_job(
                    job_best_route,
                    "cron",
                    hour=hour,
                    minute=minute,
                    day_of_week=sched.day_of_week,
                    timezone=timezone,
                    args=[sched],
                    id=job_id,
                )
                logger.debug(
                    f"Scheduled best route job: {job_id} at {sched.time} on {sched.day_of_week}"
                )
            elif sched.type == "tube_line_status":
                hour, minute = map(int, sched.time.split(":"))
                job_id = f"tube_line_status_{sched.time}_{sched.day_of_week}"
                scheduler.add_job(
                    job_tube_line_statuses,
                    "cron",
                    hour=hour,
                    minute=minute,
                    day_of_week=sched.day_of_week,
                    timezone=timezone,
                    args=[sched],
                    id=job_id,
                )
                logger.debug(
                    f"Scheduled tube line status job: {job_id} at {sched.time} on {sched.day_of_week}"
                )
            else:
                logger.warning(f"Unknown schedule type: {sched.type}")
        except Exception as e:
            logger.error(f"Failed to schedule job for {sched.type}: {str(e)}")

    try:
        scheduler.start()
        logger.info(
            f"Scheduler started successfully with {len(scheduler.get_jobs())} jobs"
        )
    except Exception as e:
        logger.error(f"Failed to start scheduler: {str(e)}")
        raise

    return scheduler


def main():
    logger.info("Starting push notification server...")

    try:
        schedules = get_schedules_with_topic()
        scheduler = schedule_jobs(schedules)
        sleep_time = os.environ.get("SCHEDULE_REFRESH_INTERVAL", 60)
        sleep_time = int(sleep_time)

        logger.info("Push notification server started. Waiting for scheduled jobs...")
        logger.info(f"Fetching updated schedules every {sleep_time} seconds...")
        logger.info(f"Scheduling jobs with timezone: {timezone}")
        logger.info(f"Logging level set to: {log_level_str}")
        logger.info(
            f"Log rotation: {max_log_size // (1024 * 1024)}MB max size, {backup_count} backup files"
        )

        # Log environment configuration
        logger.debug(
            f"SERVER_URL: {os.environ.get('SERVER_URL', 'http://localhost:8000')}"
        )
        logger.debug(f"NTFY_SERVER: {os.environ.get('NTFY_SERVER', 'default')}")
        logger.debug(f"RAIL_TOPIC: {os.environ.get('RAIL_TOPIC', 'not set')}")
        logger.debug(
            f"BEST_ROUTE_TOPIC: {os.environ.get('BEST_ROUTE_TOPIC', 'not set')}"
        )
        logger.debug(
            f"LINE_STATUS_TOPIC: {os.environ.get('LINE_STATUS_TOPIC', 'not set')}"
        )

        while True:
            time.sleep(sleep_time)

            try:
                # Make sure new schedules are picked up before shutting down old scheduler
                # Avoids the possibility of no scheduled jobs between shutdown and restart
                new_schedules = get_schedules_with_topic()
                logger.debug(f"Retrieved {len(new_schedules)} schedules for refresh")

                new_scheduler = schedule_jobs(new_schedules)
                old_scheduler = scheduler
                scheduler = new_scheduler

                logger.debug("Shutting down old scheduler...")
                old_scheduler.shutdown()
                logger.info("Scheduler refreshed with updated schedules")

            except Exception as e:
                logger.error(f"Error during schedule refresh cycle: {str(e)}")
                # Continue with existing scheduler if refresh fails

    except (KeyboardInterrupt, SystemExit):
        logger.info("Received shutdown signal")
        scheduler.shutdown()
        logger.info("Push server shut down successfully")
    except Exception as e:
        logger.error(f"Unexpected error in main loop: {str(e)}")
        scheduler.shutdown()
        raise


if __name__ == "__main__":
    main()
