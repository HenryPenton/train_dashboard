import logging
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from src.application.schedule_service import ScheduleService
from src.DTOs.schedules_dto import SchedulesDTO
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
from pathlib import Path


def configure_logger():
    logger = logging.getLogger("schedules_logger")
    if not logger.hasHandlers():
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "[%(asctime)s] %(levelname)s %(name)s: %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    logger.propagate = True
    return logger


def get_logger():
    return logging.getLogger("schedules_logger")


router = APIRouter()


def get_schedules_service():
    SCHEDULES_PATH = Path(__file__).parents[3] / "config/schedules.json"
    reader = JSONFileReader(SCHEDULES_PATH)
    writer = JSONFileWriter(SCHEDULES_PATH)
    logger = configure_logger()
    logger.debug("Creating ScheduleService")
    return ScheduleService(reader=reader, writer=writer, schedules_path=SCHEDULES_PATH, logger=logger)


@router.post("/schedules")
async def set_schedules(
    schedules: SchedulesDTO,
    schedules_service: ScheduleService = Depends(get_schedules_service),
):
    logger = get_logger()
    try:
        schedules_service.set_schedules(schedules.model_dump())
        logger.info("Setting schedules")
        return JSONResponse(content={"status": "ok"})
    except Exception as e:
        logger.error(f"Error setting schedules: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/schedules", response_model=SchedulesDTO)
def get_schedules(
    schedules_service: ScheduleService = Depends(get_schedules_service),
):
    logger = get_logger()
    try:
        schedules = schedules_service.get_schedules()
        logger.info("Getting schedules")
        return schedules
    except FileNotFoundError:
        logger.error("Schedules file not found")
        raise HTTPException(status_code=404, detail="Schedules file not found")
    except Exception as e:
        logger.error(f"Error getting schedules: {e}")
        raise HTTPException(status_code=500, detail=str(e))
