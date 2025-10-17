from fastapi import HTTPException
from src.clients.tflclient import TFLClient
from src.utils.tfl_utils import summarise_best_route, simplify_tfl_line_status
import httpx

tfl_client: TFLClient = TFLClient(httpx.AsyncClient())


async def get_best_route_handler(from_station: str, to_station: str):
    """
    Suggest the best current route from one station to another using the TFL Journey Planner API via TFLClient.
    """
    try:
        data = await tfl_client.get_best_route(from_station, to_station)
        journeys = data.get("journeys", [])
        if not journeys:
            return {"error": "No journeys found"}
        best = journeys[0]
        return summarise_best_route(best)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_tfl_line_status_handler():
    """
    Get the status of all TFL lines from the TFL API, simplified.
    """
    try:
        data = await tfl_client.get_all_lines_status()
        simplified = simplify_tfl_line_status(data)
        return simplified
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
