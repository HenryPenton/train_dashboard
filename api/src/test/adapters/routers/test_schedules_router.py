import pytest
import src.adapters.routers.schedules_router as schedules_handler
from fastapi import FastAPI
from fastapi.testclient import TestClient


class DummySchedulesService:
    def set_schedules(self, new_schedules):
        return True

    def get_schedules(self):
        return {
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


@pytest.fixture
def test_app():
    app = FastAPI()
    app.include_router(schedules_handler.router)
    app.dependency_overrides[schedules_handler.get_schedules_service] = (
        lambda: DummySchedulesService()
    )
    return TestClient(app)


def test_get_schedules_service_returns_instance():
    from src.adapters.routers.schedules_router import (
        ScheduleService,
        get_schedules_service,
    )

    service = get_schedules_service()
    assert isinstance(service, ScheduleService)


def test_get_schedules_success(test_app):
    response = test_app.get("/schedules")
    assert response.status_code == 200
    assert response.json() == {
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


def test_set_schedules_success(test_app):
    payload = {
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
    response = test_app.post("/schedules", json=payload)
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_get_schedules_not_found():
    class FailingSchedulesService:
        def get_schedules(self):
            raise FileNotFoundError()

        def set_schedules(self, new_schedules):
            pass

    app = FastAPI()
    app.include_router(schedules_handler.router)
    app.dependency_overrides[schedules_handler.get_schedules_service] = (
        lambda: FailingSchedulesService()
    )
    client = TestClient(app)
    response = client.get("/schedules")
    assert response.status_code == 404
    assert response.json()["detail"] == "Schedules file not found"


def test_set_schedules_error():
    class FailingSchedulesService:
        def set_schedules(self, new_schedules):
            raise Exception("fail")

        def get_schedules(self):
            return {
                "schedules": [{"from_station_code": "GLC", "to_station_code": "EUS"}]
            }

    app = FastAPI()
    app.include_router(schedules_handler.router)
    app.dependency_overrides[schedules_handler.get_schedules_service] = (
        lambda: FailingSchedulesService()
    )
    client = TestClient(app)
    response = client.post(
        "/schedules", json={"schedules": [{"from_station_code": "GLC"}]}
    )
    assert response.status_code == 422


def test_get_schedules_raises_exception():
    class FailingSchedulesService:
        def set_schedules(self, new_schedules):
            return True

        def get_schedules(self):
            raise Exception("Something went wrong!")

    app = FastAPI()
    app.include_router(schedules_handler.router)
    app.dependency_overrides[schedules_handler.get_schedules_service] = (
        lambda: FailingSchedulesService()
    )
    client = TestClient(app)
    response = client.get("/schedules")
    assert response.status_code == 500
    assert response.json()["detail"] == "Something went wrong!"
