from fastapi import APIRouter, HTTPException
from pathlib import Path
from src.application.station_service import StationService

router = APIRouter()
STATIONS_PATH = Path(__file__).parent.parent.parent / "data/naptan.json"

station_service = StationService(STATIONS_PATH)


@router.get("/naptan-id")
def get_naptan_ids():
    try:
        return station_service.get_stations()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
