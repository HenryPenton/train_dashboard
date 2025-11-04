from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
from src.application.config_service import ConfigService
from src.DAOs.config.config_dao import ConfigDAO

router = APIRouter()


def get_config_service():
    CONFIG_PATH = Path(__file__).parents[3] / "config/config.json"

    return ConfigService(
        reader=JSONFileReader[ConfigDAO](CONFIG_PATH),
        writer=JSONFileWriter(CONFIG_PATH),
        config_path=CONFIG_PATH,
    )


@router.post("/config")
async def set_config(
    request: Request,
    config_service: ConfigService = Depends(get_config_service),
):
    try:
        new_config = await request.json()
        config_service.set_config(new_config)
        return JSONResponse(content={"status": "ok"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/config")
def get_config(
    config_service: ConfigService = Depends(get_config_service),
):
    try:
        config_data = config_service.get_config()
        return JSONResponse(content=config_data)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Config file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
