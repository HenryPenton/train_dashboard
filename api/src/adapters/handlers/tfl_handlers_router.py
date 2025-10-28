from typing import List

import httpx
from fastapi import APIRouter, HTTPException
from src.adapters.clients.tflclient import TFLClient
from src.application.tfl_service import TFLService
from src.DTOs.tfl.line_dto import LineDTO

tfl_client: TFLClient = TFLClient(httpx.AsyncClient())
tfl_service = TFLService(tfl_client)

router = APIRouter()


@router.get("/tfl/best-route/{from_station}/{to_station}")
async def get_best_route(from_station: str, to_station: str):
    try:
        return await tfl_service.get_best_route(from_station, to_station)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tfl/line-status", response_model=List[LineDTO])
async def get_tfl_line_status():
    try:
        line_status_models = await tfl_service.get_line_status()
        line_status_dtos = [
            LineDTO(**(status_model.as_dict())) for status_model in line_status_models
        ]
        return line_status_dtos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
