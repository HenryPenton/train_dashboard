from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from src.application.schedule_service import ScheduleService
from src.DTOs.schedules_dto import SchedulesDTO
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
from pathlib import Path

router = APIRouter()


def get_schedules_service():
    SCHEDULES_PATH = Path(__file__).parents[3] / "config/schedules.json"
    reader = JSONFileReader(SCHEDULES_PATH)
    writer = JSONFileWriter(SCHEDULES_PATH)
    return ScheduleService(reader=reader, writer=writer, schedules_path=SCHEDULES_PATH)


@router.post("/schedules")
async def set_schedules(
    schedules: SchedulesDTO,
    schedules_service: ScheduleService = Depends(get_schedules_service),
):
    try:
        schedules_service.set_schedules(schedules.model_dump())
        return JSONResponse(content={"status": "ok"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/schedules", response_model=SchedulesDTO)
def get_schedules(
    schedules_service: ScheduleService = Depends(get_schedules_service),
):
    try:
        schedules = schedules_service.get_schedules()
        return schedules
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Schedules file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
