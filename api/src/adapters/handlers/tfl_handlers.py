import httpx
from fastapi import HTTPException

from src.adapters.clients.tflclient import TFLClient
from src.application.tfl_service import TFLService

tfl_client: TFLClient = TFLClient(httpx.AsyncClient())
tfl_service = TFLService(tfl_client)


async def get_best_route_handler(from_station: str, to_station: str):
    """
    Suggest the best current route from one station to another using the TFL Journey Planner API via TFLClient.
    """
    try:
        return await tfl_service.get_best_route(from_station, to_station)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_tfl_line_status_handler():
    """
    Get the status of all TFL lines from the TFL API, simplified.
    """
    try:
        return await tfl_service.get_line_status()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
