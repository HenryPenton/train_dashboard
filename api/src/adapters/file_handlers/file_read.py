import json
from pathlib import Path


class JSONFileReader:
    def __init__(self, config_path: Path):
        self.file_path = config_path

    def read_json(self):
        if not self.file_path.exists():
            raise FileNotFoundError("File not found")
        with open(self.file_path, "r") as f:
            return json.load(f)
