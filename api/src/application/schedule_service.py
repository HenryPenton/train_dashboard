from pathlib import Path

from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
from src.DAOs.schedules_dao import SchedulesDAO
from src.DTOs.schedules_dto import SchedulesDTO


class ScheduleService:
    def __init__(
        self, reader: JSONFileReader, writer: JSONFileWriter, schedules_path: Path
    ):
        self.reader = reader
        self.writer = writer
        self.schedules_path = schedules_path

    def set_schedules(self, new_schedules: dict):
        schedules = SchedulesDAO(**new_schedules)
        self.writer.write_json(schedules.model_dump())
        return True

    def get_schedules(self):
        if not self.schedules_path.exists():
            self.writer.write_json(SchedulesDAO().model_dump())
        schedules = SchedulesDTO(**self.reader.read_json())
        return schedules
