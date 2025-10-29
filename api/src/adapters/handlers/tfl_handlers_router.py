from typing import List

import httpx
from fastapi import APIRouter, HTTPException
from src.adapters.clients.tflclient import TFLClient
from src.application.tfl_service import TFLService
from src.DTOs.tfl.line_dto import LineDTO
from src.DTOs.tfl.route_dto import RouteDTO

tfl_client: TFLClient = TFLClient(httpx.AsyncClient())
tfl_service = TFLService(tfl_client)

router = APIRouter()


@router.get(
    "/tfl/best-route/{from_station}/{to_station}",
    response_model=RouteDTO,
    response_model_exclude_none=True,
)
async def get_best_route(from_station: str, to_station: str):
    try:
        route_model = await tfl_service.get_best_route(from_station, to_station)
        route_dto = RouteDTO(**(route_model.as_dict()))

        return route_dto
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tfl/line-status", response_model=List[LineDTO])
async def get_tfl_line_status():
    try:
        line_status_models = await tfl_service.get_line_statuses()
        line_status_dtos = [
            LineDTO(**(status_model.as_dict())) for status_model in line_status_models
        ]
        return line_status_dtos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
