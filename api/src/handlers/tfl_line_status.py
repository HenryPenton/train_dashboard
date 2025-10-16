from src.utils.tfl_utils import simplify_tfl_line_status
from fastapi import HTTPException
from src.clients.tflclient import TFLClient
import httpx


async def get_tfl_line_status_handler():
    """
    Get the status of all TFL lines from the TFL API, simplified.
    """
    try:
        async with httpx.AsyncClient() as client:
            tfl_client = TFLClient(client)
            data = await tfl_client.get_all_lines_status()
            simplified = simplify_tfl_line_status(data)
            return simplified
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
