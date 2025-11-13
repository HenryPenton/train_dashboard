from typing import List

import httpx
from fastapi import APIRouter, Depends, HTTPException
from src.adapters.clients.tflclient import TFLClient
from src.application.tfl_service import TFLService
from src.DTOs.tfl.line_dto import LineDTO
from src.DTOs.tfl.route_dto import RouteDTO
from src.DTOs.tfl.arrival_dto import StationArrivalsDTO
from src.shared.logging.logger_utils import configure_logger, get_logger

logger_name = "tfl_logger"
router = APIRouter()


def get_tfl_client() -> TFLClient:
    return TFLClient(httpx.AsyncClient())


def get_tfl_service(tfl_client: TFLClient = Depends(get_tfl_client)) -> TFLService:
    logger = configure_logger(logger_name)
    logger.debug("Creating TFLService")
    return TFLService(tfl_client, logger=logger)


@router.get(
    "/tfl/best-route/{from_station}/{to_station}",
    response_model=RouteDTO,
    response_model_exclude_none=True,
)
async def get_best_route(
    from_station: str,
    to_station: str,
    tfl_service: TFLService = Depends(get_tfl_service),
):
    logger = get_logger(logger_name)
    try:
        logger.info(f"Getting best route from {from_station} to {to_station}")
        route_model = await tfl_service.get_best_route(from_station, to_station)
        route_dto = RouteDTO(**(route_model.as_dict()))
        return route_dto
    except Exception as e:
        logger.error(f"Error getting best route: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tfl/line-status", response_model=List[LineDTO])
async def get_tfl_line_status(
    tfl_service: TFLService = Depends(get_tfl_service),
):
    logger = get_logger(logger_name)
    try:
        logger.info("Getting TfL line statuses")
        line_status_models = await tfl_service.get_line_statuses()
        line_status_dtos = [
            LineDTO(**(status_model.as_dict())) for status_model in line_status_models
        ]
        return line_status_dtos
    except Exception as e:
        logger.error(f"Error getting TfL line statuses: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tfl/arrivals/{station_id}", response_model=StationArrivalsDTO, response_model_exclude_none=True)
async def get_station_arrivals(
    station_id: str,
    tfl_service: TFLService = Depends(get_tfl_service),
):
    logger = get_logger(logger_name)
    try:
        logger.info(f"Getting tube arrivals for station {station_id}")
        arrivals_data = await tfl_service.get_arrivals_by_line(station_id)
        return StationArrivalsDTO(**arrivals_data)
    except Exception as e:
        logger.error(f"Error getting arrivals for station {station_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
