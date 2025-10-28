from pathlib import Path

from src.adapters.file_handlers.json.json_file_read import JSONFileReader
from src.adapters.file_handlers.json.json_file_write import JSONFileWriter
from src.schemas.bidirectional.config.config_schema import ConfigSchema

CONFIG_PATH = Path(__file__).parent.parent.parent / "config/config.json"


class ConfigService:
    @staticmethod
    def set_config(new_config: dict):
        config_schema = ConfigSchema()
        config = config_schema.load(new_config)

        writer = JSONFileWriter(CONFIG_PATH)
        writer.write_json(config_schema.dump(config))
        return True

    @staticmethod
    def get_config():
        adapter = JSONFileReader(CONFIG_PATH)

        config_schema = ConfigSchema()
        config = config_schema.load(adapter.read_json())

        return config_schema.dump(config)
