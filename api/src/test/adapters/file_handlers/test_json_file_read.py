import json
import os
import tempfile
from pathlib import Path

import pytest

from src.adapters.file_handlers.json.json_file_read import JSONFileReader


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


def test_read_json_with_postprocessor():
    data = {"numbers": [1, 2, 3, 4, 5]}

    def postprocess(raw_data):
        return [x * 2 for x in raw_data["numbers"]]

    with tempfile.NamedTemporaryFile(mode="w+", delete=False) as tmp:
        json.dump(data, tmp)
        tmp_path = Path(tmp.name)
    try:
        reader = JSONFileReader(tmp_path, postprocess_fn=postprocess)
        result = reader.read_json()
        assert result == [2, 4, 6, 8, 10]
    finally:
        os.remove(tmp_path)
