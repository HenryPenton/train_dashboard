from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
from src.application.schedule_service import ScheduleService
from src.DTOs.schedules_dto import SchedulesDTO
from src.shared.logging.logger_utils import configure_logger, get_logger

logger_name = "schedules_logger"
router = APIRouter()


def get_schedules_service():
    SCHEDULES_PATH = Path(__file__).parents[3] / "config/schedules.json"
    reader = JSONFileReader(SCHEDULES_PATH)
    writer = JSONFileWriter(SCHEDULES_PATH)
    logger = configure_logger(logger_name)
    logger.debug("Creating ScheduleService")
    return ScheduleService(
        reader=reader, writer=writer, schedules_path=SCHEDULES_PATH, logger=logger
    )


@router.post("/schedules")
async def set_schedules(
    schedules: SchedulesDTO,
    schedules_service: ScheduleService = Depends(get_schedules_service),
):
    logger = get_logger(logger_name)
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
    logger = get_logger(logger_name)
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
