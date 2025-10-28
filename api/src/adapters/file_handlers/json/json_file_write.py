import json
from pathlib import Path


class JSONFileWriter:
    def __init__(self, path: Path):
        self.path = path

    def write_json(self, data: dict):
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
