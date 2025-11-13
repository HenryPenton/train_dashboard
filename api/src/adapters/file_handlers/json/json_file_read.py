from typing import TypeVar, Generic, Callable, Any, Optional
import json
from pathlib import Path
from abc import ABC, abstractmethod

T = TypeVar("T")


class AbstractFileReader(ABC, Generic[T]):
    def __init__(self, file_path: Path):
        self.file_path = file_path

    @abstractmethod
    def read_json(self) -> T:  # pragma: no cover
        pass


class JSONFileReader(AbstractFileReader[T]):
    def __init__(
        self, config_path: Path, postprocess_fn: Optional[Callable[[Any], T]] = None
    ):
        super().__init__(config_path)
        self.postprocess_fn = postprocess_fn

    def read_json(self) -> T:
        if not self.file_path.exists():
            raise FileNotFoundError("File not found")
        with open(self.file_path, "r") as f:
            data = json.load(f)
        if self.postprocess_fn:
            return self.postprocess_fn(data)
        return data
