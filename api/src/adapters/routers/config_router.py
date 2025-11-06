import logging
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
from src.application.config_service import ConfigService
from src.DAOs.config.config_dao import ConfigDAO
from src.DTOs.config.config_dto import ConfigDTO

router = APIRouter()


def configure_logger():
    logger = logging.getLogger("config_logger")

    if not logger.hasHandlers():
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "[%(asctime)s] %(levelname)s %(name)s: %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger


def get_logger():
    return logging.getLogger("config_logger")


def get_config_service():
    CONFIG_PATH = Path(__file__).parents[3] / "config/config.json"
    logger = configure_logger()

    logger.info("Creating ConfigService")
    return ConfigService(
        reader=JSONFileReader[ConfigDAO](CONFIG_PATH),
        writer=JSONFileWriter(CONFIG_PATH),
        config_path=CONFIG_PATH,
        logger=logger,
    )


@router.post("/config")
async def set_config(
    request: ConfigDTO,
    config_service: ConfigService = Depends(get_config_service),
):
    logger = get_logger()
    try:
        config_service.set_config(request)
        logger.info("Setting config")
        return JSONResponse(content={"status": "ok"})
    except Exception as e:
        logger.error("Error setting config")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/config", response_model=ConfigDTO)
def get_config(
    config_service: ConfigService = Depends(get_config_service),
):
    logger = get_logger()
    try:
        config_data = config_service.get_config()
        logger.info("Getting config")
        return config_data
    except FileNotFoundError:
        logger.error("Config file not found")
        raise HTTPException(status_code=404, detail="Config file not found")
    except Exception as e:
        logger.error("Error getting config")
        raise HTTPException(status_code=500, detail=str(e))
