from fastapi import APIRouter, HTTPException
from pathlib import Path
from src.application.station_service import StationService

router = APIRouter()
STATIONS_PATH = Path(__file__).parent.parent.parent / "data/naptan.json"

station_service = StationService(STATIONS_PATH)


@router.get("/naptan-id")
def get_naptan_ids():
    try:
        stations = station_service.get_stations()
        return [station.__dict__ for station in stations]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
