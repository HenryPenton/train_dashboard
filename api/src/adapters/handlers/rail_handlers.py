import httpx
from fastapi import HTTPException

from src.adapters.clients.rttclient import RTTClient
from src.application.rail_service import RailService

rtt_client: RTTClient = RTTClient(httpx.AsyncClient())
rail_service = RailService(rtt_client)


async def get_departures_handler(
    origin_station_code: str, destination_station_code: str
):
    """
    Get departures from a station using the Real Time Trains API, filtered by destination station code.
    """

    try:
        return await rail_service.get_departures(
            origin_station_code, destination_station_code
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
