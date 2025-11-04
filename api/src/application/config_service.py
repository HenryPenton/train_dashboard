from pathlib import Path

from src.adapters.file_handlers.json.json_file_read import AbstractFileReader
from src.adapters.file_handlers.json.json_file_write import AbstractFileWriter
from src.DAOs.config.config_dao import ConfigDAO
from src.DTOs.config.config_dto import ConfigDTO


class ConfigService:
    def __init__(
        self, reader: AbstractFileReader, writer: AbstractFileWriter, config_path: Path
    ):
        self.reader = reader
        self.writer = writer
        self.config_path = config_path

    def set_config(self, new_config: dict):
        config = ConfigDAO(**new_config)
        self.writer.write_json(config.model_dump())
        return True

    def get_config(self):
        if not self.config_path.exists():
            self.writer.write_json(ConfigDAO().model_dump())
        config = ConfigDTO(**self.reader.read_json())
        return config.model_dump()
