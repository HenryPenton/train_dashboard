import tempfile
import json
import os
import pytest
from pathlib import Path
from src.adapters.file_handlers.json_file_read import JSONFileReader


def test_read_json_success():
    data = {"foo": "bar"}
    with tempfile.NamedTemporaryFile(mode="w+", delete=False) as tmp:
        json.dump(data, tmp)
        tmp_path = Path(tmp.name)
    try:
        reader = JSONFileReader(tmp_path)
        result = reader.read_json()
        assert result == data
    finally:
        os.remove(tmp_path)


def test_read_json_file_not_found():
    reader = JSONFileReader(Path("/tmp/does_not_exist.json"))
    with pytest.raises(FileNotFoundError):
        reader.read_json()
