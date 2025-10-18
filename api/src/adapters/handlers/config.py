from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from src.application.config_service import ConfigService

router = APIRouter()


@router.get("/config")
def get_config():
    try:
        config_data = ConfigService.get_config()
        return JSONResponse(content=config_data)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Config file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
