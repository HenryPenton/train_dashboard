from fastapi import APIRouter
from pathlib import Path
import json

router = APIRouter()

STATIONS_PATH = Path(__file__).parent.parent.parent / "data/stations.json"


@router.get("/atco-code")
def get_atco_codes():
    try:
        with open(STATIONS_PATH, "r", encoding="utf-8") as f:
            stations = json.load(f)
        # Only return ATCOCode and CommonName
        filtered = [
            {"ATCOCode": s["ATCOCode"], "CommonName": s["CommonName"]}
            for s in stations
            if "ATCOCode" in s and "CommonName" in s
        ]
        filtered.sort(key=lambda x: x["CommonName"].lower())
        return filtered
    except Exception as e:
        return {"error": str(e)}
