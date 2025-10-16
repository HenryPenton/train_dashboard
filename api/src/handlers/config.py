import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path

router = APIRouter()

CONFIG_PATH = Path(__file__).parent.parent.parent / "config.json"


@router.get("/config")
def get_config():
    if not CONFIG_PATH.exists():
        raise HTTPException(status_code=404, detail="Config file not found")
    try:
        with open(CONFIG_PATH, "r") as f:
            config_data = json.load(f)
        return JSONResponse(content=config_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
