from src.DTOs.station.station_dto import StationDTO
from fastapi import APIRouter, HTTPException, Depends
from pathlib import Path

from src.application.station_service import StationService
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.generators.station_model_generator import (
    naptan_postprocess,
)

router = APIRouter()


def get_station_service():
    STATIONS_PATH = Path(__file__).parents[2] / "data/naptan.json"
    reader = JSONFileReader(STATIONS_PATH, postprocess_fn=naptan_postprocess)
    return StationService(reader)


@router.get("/naptan-id", response_model=list[StationDTO])
def get_naptan_ids(
    station_service: StationService = Depends(get_station_service),
):
    try:
        station_models = station_service.get_stations()
        return [
            StationDTO(naptanID=station.naptanID, CommonName=station.commonName)
            for station in station_models
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
