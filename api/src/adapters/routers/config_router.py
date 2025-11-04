from fastapi import Request
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from src.application.config_service import ConfigService


router = APIRouter()
config_service = ConfigService()


@router.post("/config")
async def set_config(request: Request):
    try:
        new_config = await request.json()
        config_service.set_config(new_config)
        return JSONResponse(content={"status": "ok"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/config")
def get_config():
    try:
        config_data = config_service.get_config()
        return JSONResponse(content=config_data)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Config file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
