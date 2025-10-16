import httpx
from fastapi import HTTPException
from src.utils.departures_utils import process_departures_response
from src.rttclient.rttclient import RTTClient


async def get_departures_handler(
    origin_station_code: str, destination_station_code: str
):
    """
    Get departures from a station using the Real Time Trains API, filtered by destination station code.
    """

    async with httpx.AsyncClient() as client:
        rtt_client = RTTClient(client)
        try:
            data = await rtt_client.get_departures(
                origin_station_code, destination_station_code
            )
            processed = process_departures_response(data)
            return processed
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
