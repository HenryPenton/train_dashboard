import logging
from pathlib import Path

from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
from src.DAOs.schedules_dao import SchedulesDAO
from src.DTOs.schedules_dto import SchedulesDTO


class ScheduleService:
    def __init__(
        self,
        reader: JSONFileReader,
        writer: JSONFileWriter,
        schedules_path: Path,
        logger: logging.Logger,
    ):
        self.reader = reader
        self.writer = writer
        self.schedules_path = schedules_path
        self.logger = logger

    def set_schedules(self, new_schedules: dict):
        schedules = SchedulesDAO(**new_schedules)
        self.writer.write_json(schedules.model_dump())
        self.logger.info("Schedules written to file.")
        return True

    def get_schedules(self):
        if not self.schedules_path.exists():
            self.logger.info(
                f"Schedules file {self.schedules_path} does not exist. Creating default schedules file."
            )
            self.writer.write_json(SchedulesDAO().model_dump())
        else:
            self.logger.debug(f"Reading schedules from {self.schedules_path}")
        schedules = SchedulesDTO(**self.reader.read_json())
        self.logger.info("Schedules loaded.")
        return schedules
