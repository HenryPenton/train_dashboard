import json
from pathlib import Path

CONFIG_PATH = Path(__file__).parent.parent.parent / "config.json"


class ConfigService:
    @staticmethod
    def get_config():
        if not CONFIG_PATH.exists():
            raise FileNotFoundError("Config file not found")
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
