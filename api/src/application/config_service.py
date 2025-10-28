from pathlib import Path

from src.models.bidirectional.config.config_model import ConfigModel
from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter


CONFIG_PATH = Path(__file__).parent.parent.parent / "config/config.json"


class ConfigService:
    @staticmethod
    def set_config(new_config: dict):
        config = ConfigModel(**new_config)
        writer = JSONFileWriter(CONFIG_PATH)
        writer.write_json(config.model_dump())
        return True

    @staticmethod
    def get_config():
        adapter = JSONFileReader(CONFIG_PATH)
        config = ConfigModel(**adapter.read_json())
        return config.model_dump()
