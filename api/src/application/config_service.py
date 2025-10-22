from pathlib import Path
from src.adapters.file_handlers.json_file_write import JSONFileWriter
from src.adapters.file_handlers.json_file_read import JSONFileReader
from src.domain.config.config import Config


CONFIG_PATH = Path(__file__).parent.parent.parent / "config/config.json"


class ConfigService:
    @staticmethod
    def set_config(new_config: dict):
        config = Config.process_config(new_config)
        writer = JSONFileWriter(CONFIG_PATH)
        writer.write_json(config)
        return True

    @staticmethod
    def get_config():
        adapter = JSONFileReader(CONFIG_PATH)

        config = adapter.read_json()
        return Config.process_config(config)
