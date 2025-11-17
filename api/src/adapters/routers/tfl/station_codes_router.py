from pathlib import Path
from typing import Optional
from enum import Enum

from fastapi import APIRouter, Depends, HTTPException, Query
from src.adapters.file_handlers.json.generators.station_model_generator import (
    naptan_postprocess,
)
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.application.station_service import StationService
from src.DTOs.station.station_dto import StationDTO
from src.shared.logging.logger_utils import configure_logger, get_logger


class StationType(str, Enum):
    naptan = "naptan"
    tube = "tube"


router = APIRouter()
logger_name = "station_codes_logger"


def get_reader(
    station_type: StationType = Query(
        StationType.naptan,
        description="Type of stations: 'naptan' for all stations, 'tube' for tube stations only",
    ),
):
    filename = "tube.json" if station_type == StationType.tube else "naptan.json"
    STATIONS_PATH = Path(__file__).resolve().parents[3] / f"data/{filename}"
    return JSONFileReader(STATIONS_PATH, postprocess_fn=naptan_postprocess)


def get_station_service(reader: JSONFileReader = Depends(get_reader)):
    logger = configure_logger(logger_name)
    return StationService(reader, logger)


@router.get("/tfl/station-codes", response_model=list[StationDTO])
def get_station_codes(
    station_service: StationService = Depends(get_station_service),
):
    logger = get_logger(logger_name)
    try:
        station_models = station_service.get_stations()
        logger.info("Getting station codes")
        return [
            StationDTO(naptanID=station.naptanID, CommonName=station.commonName)
            for station in station_models
        ]
    except Exception as e:
        logger.error("Error getting station codes")
        raise HTTPException(status_code=500, detail=str(e))
