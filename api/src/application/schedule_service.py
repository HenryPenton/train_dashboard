from pathlib import Path

from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
from src.DAOs.schedules_dao import SchedulesDAO
from src.DTOs.schedules_dto import SchedulesDTO

SCHEDULES_PATH = Path(__file__).parent.parent.parent / "config/schedules.json"


class ScheduleService:
    @staticmethod
    def set_schedules(new_schedules: dict):
        schedules = SchedulesDAO(**new_schedules)
        writer = JSONFileWriter(SCHEDULES_PATH)
        writer.write_json(schedules.model_dump())
        return True

    @staticmethod
    def get_schedules():
        if not SCHEDULES_PATH.exists():
            writer = JSONFileWriter(SCHEDULES_PATH)
            writer.write_json(SchedulesDAO().model_dump())

        json_file_reader = JSONFileReader(SCHEDULES_PATH)
        schedules = SchedulesDTO(**json_file_reader.read_json())
        return schedules.model_dump()
