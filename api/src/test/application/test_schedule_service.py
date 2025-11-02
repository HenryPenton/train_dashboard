import shutil
import tempfile
from pathlib import Path

import pytest
from src.application.schedule_service import ScheduleService


# Use a temp file for isolation
def temp_schedules_path(monkeypatch):
    tmp_dir = tempfile.mkdtemp()
    tmp_path = Path(tmp_dir) / "schedules.json"
    monkeypatch.setattr("src.application.schedule_service.SCHEDULES_PATH", tmp_path)
    yield tmp_path
    shutil.rmtree(tmp_dir)


# Example valid and invalid payloads
valid_schedules = {
    "schedules": [
        {
            "type": "rail_departure",
            "from_station_code": "GLC",
            "to_station_code": "EUS",
            "from_station_name": "Glasgow Central",
            "to_station_name": "Euston",
            "day_of_week": "mon",
            "time": "17:38",
        }
    ]
}

invalid_schedules = {
    "schedules": [
        {
            "type": "rail_departure",
            # missing required fields
            "from_station_code": "GLC",
        }
    ]
}


def test_set_and_get_schedules_happy(monkeypatch):
    for _ in temp_schedules_path(monkeypatch):
        # Set schedules
        assert ScheduleService.set_schedules(valid_schedules) is True
        # Get schedules
        result = ScheduleService.get_schedules()
        assert result["schedules"][0]["from_station_code"] == "GLC"
        assert result["schedules"][0]["to_station_code"] == "EUS"


def test_set_schedules_unhappy(monkeypatch):
    for _ in temp_schedules_path(monkeypatch):
        # Should raise error due to missing required fields
        with pytest.raises(Exception):
            ScheduleService.set_schedules(invalid_schedules)


def test_get_schedules_creates_file(monkeypatch):
    for tmp_path in temp_schedules_path(monkeypatch):
        # File should not exist
        if tmp_path.exists():
            tmp_path.unlink()
        # Should create file and return default
        result = ScheduleService.get_schedules()
        assert "schedules" in result
        assert tmp_path.exists()
