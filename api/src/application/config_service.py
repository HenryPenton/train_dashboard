from pathlib import Path
from src.adapters.file_handlers.json_file_read import JSONFileReader
from src.domain.config.config import Config

CONFIG_PATH = Path(__file__).parent.parent.parent / "config.json"


class ConfigService:
    @staticmethod
    def get_config():
        adapter = JSONFileReader(CONFIG_PATH)

        config = adapter.read_json()
        return Config.process_config(config)
