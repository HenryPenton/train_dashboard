import tempfile
import json
from pathlib import Path
from src.adapters.file_handlers.json_file_write import JSONFileWriter


def test_write_json_writes_file():
    # Create a temporary file
    with tempfile.TemporaryDirectory() as tmpdir:
        path = Path(tmpdir) / "test.json"
        writer = JSONFileWriter(path)
        data = {"foo": "bar", "num": 42, "nested": {"a": 1}}
        writer.write_json(data)

        # Read back the file and check contents
        with open(path, "r", encoding="utf-8") as f:
            loaded = json.load(f)
        assert loaded == data
