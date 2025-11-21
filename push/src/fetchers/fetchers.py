import logging
import os

import requests

API_BASE = os.environ.get("SERVER_URL", "http://localhost:8000")
logger = logging.getLogger(__name__)


def fetch_rail_departures(from_station, to_station):
    url = f"{API_BASE}/rail/departures/{from_station}/to/{to_station}"
    logger.debug(f"Fetching rail departures from URL: {url}")

    try:
        resp = requests.get(url, timeout=30)
        logger.debug(f"API response status: {resp.status_code}")
        resp.raise_for_status()

        data = resp.json()
        count = len(data) if isinstance(data, list) else "unknown count"
        logger.debug(f"Successfully fetched rail departures: {count} items")
        return data

    except Exception as e:
        logger.error(f"Error fetching from {url}: {str(e)}")
        raise


def fetch_best_route(from_station, to_station):
    url = f"{API_BASE}/tfl/best-route/{from_station}/{to_station}"
    logger.debug(f"Fetching best route from URL: {url}")

    try:
        resp = requests.get(url, timeout=30)
        logger.debug(f"API response status: {resp.status_code}")
        resp.raise_for_status()

        data = resp.json()
        logger.debug(f"Successfully fetched best route data: {type(data)}")
        return data

    except Exception as e:
        logger.error(f"Error fetching from {url}: {str(e)}")
        raise


def fetch_tube_line_statuses():
    url = f"{API_BASE}/tfl/line-status"
    logger.debug(f"Fetching tube line statuses from URL: {url}")

    try:
        resp = requests.get(url, timeout=30)
        logger.debug(f"API response status: {resp.status_code}")
        resp.raise_for_status()

        data = resp.json()
        count = len(data) if isinstance(data, list) else "unknown count"
        logger.debug(f"Successfully fetched tube line statuses: {count} items")
        return data

    except Exception as e:
        logger.error(f"Error fetching from {url}: {str(e)}")
        raise
