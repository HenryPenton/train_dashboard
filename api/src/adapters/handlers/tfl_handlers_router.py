import httpx
from fastapi import HTTPException, APIRouter
from src.adapters.clients.tflclient import TFLClient
from src.application.tfl_service import TFLService

tfl_client: TFLClient = TFLClient(httpx.AsyncClient())
tfl_service = TFLService(tfl_client)

router = APIRouter()


@router.get("/tfl/best-route/{from_station}/{to_station}")
async def get_best_route(from_station: str, to_station: str):
    try:
        return await tfl_service.get_best_route(from_station, to_station)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tfl/line-status")
async def get_tfl_line_status():
    try:
        return await tfl_service.get_line_status()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
