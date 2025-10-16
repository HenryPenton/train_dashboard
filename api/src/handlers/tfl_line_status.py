from src.utils.tfl_utils import simplify_tfl_line_status
import httpx
from fastapi import HTTPException


async def get_tfl_line_status_handler():
    """
    Get the status of all TFL lines from the TFL API, simplified.
    """
    url = "https://api.tfl.gov.uk/Line/Mode/tube,overground,dlr,elizabeth-line,tram/status"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()  # List of line status objects
            simplified = simplify_tfl_line_status(data)
            return simplified
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
