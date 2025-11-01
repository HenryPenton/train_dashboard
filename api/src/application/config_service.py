from pathlib import Path

from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
from src.DAOs.config.config_dao import ConfigDAO
from src.DTOs.config.config_dto import ConfigDTO

CONFIG_PATH = Path(__file__).parent.parent.parent / "config/config.json"


class ConfigService:
    @staticmethod
    def set_config(new_config: dict):
        config = ConfigDAO(**new_config)
        writer = JSONFileWriter(CONFIG_PATH)
        writer.write_json(config.model_dump())
        return True

    @staticmethod
    def get_config():
        reader = JSONFileReader(CONFIG_PATH)
        if not CONFIG_PATH.exists():
            writer = JSONFileWriter(CONFIG_PATH)
            writer.write_json(ConfigDAO().model_dump())
        config = ConfigDTO(**reader.read_json())
        return config.model_dump()
