import json
from abc import ABC, abstractmethod
from pathlib import Path


class AbstractFileWriter(ABC):
    def __init__(self, path: Path):
        self.path = path

    @abstractmethod
    def write_json(self, data: dict):
        pass


class JSONFileWriter(AbstractFileWriter):
    def write_json(self, data: dict):
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
