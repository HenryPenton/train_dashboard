from fastapi import APIRouter
from pathlib import Path
from src.application.station_service import StationService

router = APIRouter()
STATIONS_PATH = Path(__file__).parent.parent.parent / "data/stations.json"

station_service = StationService(STATIONS_PATH)


@router.get("/atco-code")
def get_atco_codes():
    try:
        stations = station_service.get_stations()
        # Return as dicts for API response
        return [station.__dict__ for station in stations]
    except Exception as e:
        return {"error": str(e)}
