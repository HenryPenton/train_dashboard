
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from src.application.schedule_service import ScheduleService
from src.DTOs.schedules_dto import SchedulesDTO

router = APIRouter()
schedules_service = ScheduleService()



@router.post("/schedules")
async def set_schedules(schedules: SchedulesDTO):
    try:
        schedules_service.set_schedules(schedules.model_dump())
        return JSONResponse(content={"status": "ok"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/schedules", response_model=SchedulesDTO)
def get_schedules():
    try:
        config_data = schedules_service.get_schedules()
        return config_data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Schedules file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
