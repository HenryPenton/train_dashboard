import logging
import os
from typing import List

import requests
from pydantic import ValidationError
from src.models.models import BestRoute, RailDeparture, TubeLineStatus

API_BASE = os.environ.get("SERVER_URL", "http://localhost:8000")
logger = logging.getLogger(__name__)


def fetch_rail_departures(from_station, to_station) -> List[RailDeparture]:
    url = f"{API_BASE}/rail/departures/{from_station}/to/{to_station}"
    logger.debug(f"Fetching rail departures from URL: {url}")

    try:
        resp = requests.get(url, timeout=30)
        logger.debug(f"API response status: {resp.status_code}")
        resp.raise_for_status()

        data = resp.json()
        departures = [RailDeparture(**item) for item in data]
        logger.debug(f"Successfully fetched rail departures: {len(departures)} items")
        return departures

    except ValidationError as e:
        logger.error(f"Invalid data format from {url}: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error fetching from {url}: {str(e)}")
        raise


def fetch_best_route(from_station, to_station) -> BestRoute:
    url = f"{API_BASE}/tfl/best-route/{from_station}/{to_station}"
    logger.debug(f"Fetching best route from URL: {url}")

    try:
        resp = requests.get(url, timeout=30)
        logger.debug(f"API response status: {resp.status_code}")
        resp.raise_for_status()

        data = resp.json()
        route = BestRoute(**data)
        logger.debug(f"Successfully fetched best route data: {type(route)}")
        return route

    except ValidationError as e:
        logger.error(f"Invalid data format from {url}: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error fetching from {url}: {str(e)}")
        raise


def fetch_tube_line_statuses() -> List[TubeLineStatus]:
    url = f"{API_BASE}/tfl/line-status"
    logger.debug(f"Fetching tube line statuses from URL: {url}")

    try:
        resp = requests.get(url, timeout=30)
        logger.debug(f"API response status: {resp.status_code}")
        resp.raise_for_status()

        data = resp.json()
        statuses = [TubeLineStatus(**item) for item in data]
        logger.debug(f"Successfully fetched tube line statuses: {len(statuses)} items")
        return statuses

    except ValidationError as e:
        logger.error(f"Invalid data format from {url}: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error fetching from {url}: {str(e)}")
        raise
