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


def get_job_id(sched):
    """Generate a unique job ID for a schedule."""
    if sched.type == "rail_departure":
        return f"rail_{sched.from_station_code}_{sched.to_station_code}_{sched.time}_{sched.day_of_week}"
    elif sched.type == "best_route":
        return f"best_route_{sched.from_code}_{sched.to_code}_{sched.time}_{sched.day_of_week}"
    elif sched.type == "tube_line_status":
        return f"tube_line_status_{sched.time}_{sched.day_of_week}"
    return None


def add_job_to_scheduler(scheduler, sched, job_id):
    """Add a single job to the scheduler based on schedule type."""
    hour, minute = map(int, sched.time.split(":"))

    job_func = {
        "rail_departure": job_rail_departures,
        "best_route": job_best_route,
        "tube_line_status": job_tube_line_statuses,
    }.get(sched.type)

    if not job_func:
        logger.warning(f"Unknown schedule type: {sched.type}")
        return False

    scheduler.add_job(
        job_func,
        "cron",
        hour=hour,
        minute=minute,
        day_of_week=sched.day_of_week,
        timezone=timezone,
        args=[sched],
        id=job_id,
    )
    logger.debug(
        f"Scheduled {sched.type} job: {job_id} at {sched.time} on {sched.day_of_week}"
    )
    return True


def sync_scheduler_jobs(scheduler, schedules):
    """Sync scheduler jobs with the provided schedules, adding/removing as needed."""
    logger.info(f"Syncing scheduler with {len(schedules)} schedules")

    # Build a set of desired job IDs from new schedules
    desired_job_ids = set()
    schedule_by_id = {}

    for sched in schedules:
        job_id = get_job_id(sched)
        if job_id:
            desired_job_ids.add(job_id)
            schedule_by_id[job_id] = sched

    # Get current job IDs
    current_job_ids = {job.id for job in scheduler.get_jobs()}

    # Remove jobs that are no longer in schedules
    jobs_to_remove = current_job_ids - desired_job_ids
    for job_id in jobs_to_remove:
        scheduler.remove_job(job_id)
        logger.debug(f"Removed job: {job_id}")

    # Add jobs that are new
    jobs_to_add = desired_job_ids - current_job_ids
    for job_id in jobs_to_add:
        sched = schedule_by_id[job_id]
        try:
            add_job_to_scheduler(scheduler, sched, job_id)
        except Exception as e:
            logger.error(f"Failed to schedule job {job_id}: {str(e)}")

    total_jobs = len(scheduler.get_jobs())

    if jobs_to_remove or jobs_to_add:
        logger.info(
            f"Scheduler sync complete: removed {len(jobs_to_remove)}, "
            f"added {len(jobs_to_add)} jobs. Total jobs: {total_jobs}"
        )
    else:
        logger.debug(f"No changes to scheduled jobs. Total jobs: {total_jobs}")

    return len(jobs_to_remove), len(jobs_to_add)


def create_scheduler(schedules=[]):
    """Create and start a new scheduler with the given schedules."""
    logger.info(f"Creating scheduler with {len(schedules)} jobs")
    scheduler = BackgroundScheduler()

    for sched in schedules:
        try:
            job_id = get_job_id(sched)
            if not job_id:
                logger.warning(f"Unknown schedule type: {sched.type}")
                continue
            add_job_to_scheduler(scheduler, sched, job_id)
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
    scheduler = None

    try:
        schedules = get_schedules_with_topic()
        scheduler = create_scheduler(schedules)
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
                # Sync jobs in the existing scheduler instead of recreating it
                new_schedules = get_schedules_with_topic()
                logger.debug(f"Retrieved {len(new_schedules)} schedules for refresh")

                sync_scheduler_jobs(scheduler, new_schedules)

            except Exception as e:
                logger.error(f"Error during schedule refresh cycle: {str(e)}")
                # Continue with existing scheduler if refresh fails

    except (KeyboardInterrupt, SystemExit):
        logger.info("Received shutdown signal")
        if scheduler:
            scheduler.shutdown()
        logger.info("Push server shut down successfully")
    except Exception as e:
        logger.error(f"Unexpected error in main loop: {str(e)}")
        if scheduler:
            scheduler.shutdown()
        raise


if __name__ == "__main__":
    main()
