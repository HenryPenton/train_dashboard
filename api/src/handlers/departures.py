from src.utils.departures_utils import process_departures_response
import httpx
from fastapi import HTTPException


async def get_departures_handler(station_code: str):
    """
    Get departures from a station using the Real Time Trains API.
    """
    REALTIME_TRAINS_API_BASE = "https://api.rtt.io/api/v1/json"
    import os
    REALTIME_TRAINS_API_USER = os.getenv("RTT_API_USER", "your_username")
    REALTIME_TRAINS_API_PASS = os.getenv("RTT_API_PASS", "your_password")
    url = f"{REALTIME_TRAINS_API_BASE}/search/{station_code}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, auth=(REALTIME_TRAINS_API_USER, REALTIME_TRAINS_API_PASS))
            response.raise_for_status()
            data = response.json()
            processed = process_departures_response(data)
            return processed
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
