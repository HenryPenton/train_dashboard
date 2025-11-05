from fastapi import FastAPI
from fastapi.testclient import TestClient
import src.adapters.routers.config_router as config_handler
import pytest


class DummyConfigService:
    def set_config(self, new_config):
        return True

    def get_config(self):
        return {"foo": "bar"}


@pytest.fixture
def test_app():
    app = FastAPI()
    app.include_router(config_handler.router)
    app.dependency_overrides[config_handler.get_config_service] = (
        lambda: DummyConfigService()
    )
    return TestClient(app)


def test_get_config_service_returns_instance():
    from src.adapters.routers.config_router import get_config_service, ConfigService

    service = get_config_service()
    assert isinstance(service, ConfigService)


def test_get_config_success(test_app):
    response = test_app.get("/config")
    assert response.status_code == 200
    # config replaced by default if its missing - wrong properties are removed
    assert response.json() == {
        "rail_departures": [],
        "refresh_timer": 300,
        "show_tfl_lines": False,
        "tfl_best_routes": [],
    }


def test_set_config_success(test_app):
    payload = {"hello": "world"}
    response = test_app.post("/config", json=payload)
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_get_config_not_found():
    class FailingConfigService:
        def get_config(self):
            raise FileNotFoundError()

        def set_config(self, new_config):
            pass

    app = FastAPI()
    app.include_router(config_handler.router)
    app.dependency_overrides[config_handler.get_config_service] = (
        lambda: FailingConfigService()
    )
    client = TestClient(app)
    response = client.get("/config")
    assert response.status_code == 404
    assert response.json()["detail"] == "Config file not found"


def test_set_config_error():
    class FailingConfigService:
        def set_config(self, new_config):
            raise Exception("fail")

        def get_config(self):
            return {"foo": "bar"}

    app = FastAPI()
    app.include_router(config_handler.router)
    app.dependency_overrides[config_handler.get_config_service] = (
        lambda: FailingConfigService()
    )
    client = TestClient(app)
    response = client.post("/config", json={"bad": "data"})
    assert response.status_code == 500
    assert "fail" in response.json()["detail"]


def test_get_config_raises_exception():
    class FailingConfigService:
        def set_config(self, new_config):
            return True

        def get_config(self):
            raise Exception("Something went wrong!")

    app = FastAPI()
    app.include_router(config_handler.router)
    app.dependency_overrides[config_handler.get_config_service] = (
        lambda: FailingConfigService()
    )
    client = TestClient(app)
    response = client.get("/config")
    assert response.status_code == 500
    assert response.json()["detail"] == "Something went wrong!"
