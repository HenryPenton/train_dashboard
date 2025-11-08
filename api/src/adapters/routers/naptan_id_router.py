from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from src.adapters.file_handlers.json.generators.station_model_generator import (
    naptan_postprocess,
)
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.application.station_service import StationService
from src.DTOs.station.station_dto import StationDTO
from src.shared.logging.logger_utils import configure_logger, get_logger

router = APIRouter()
logger_name = "naptan_logger"


def get_station_service():
    STATIONS_PATH = Path(__file__).parents[2] / "data/naptan.json"
    logger = configure_logger(logger_name)
    logger.debug("Creating StationService")
    reader = JSONFileReader(STATIONS_PATH, postprocess_fn=naptan_postprocess)
    return StationService(reader, logger)


@router.get("/naptan-id", response_model=list[StationDTO])
def get_naptan_ids(
    station_service: StationService = Depends(get_station_service),
):
    logger = get_logger(logger_name)
    try:
        station_models = station_service.get_stations()
        logger.info("Getting naptan ids")
        return [
            StationDTO(naptanID=station.naptanID, CommonName=station.commonName)
            for station in station_models
        ]
    except Exception as e:
        logger.error("Error getting naptan ids")
        raise HTTPException(status_code=500, detail=str(e))
