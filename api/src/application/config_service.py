from pathlib import Path
from src.adapters.file_handlers.json_file_read import JSONFileReader

CONFIG_PATH = Path(__file__).parent.parent.parent / "config.json"


class ConfigService:
    @staticmethod
    def get_config():
        adapter = JSONFileReader(CONFIG_PATH)
        return adapter.read_json()
